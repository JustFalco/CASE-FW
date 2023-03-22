using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Data_access_layer.Repositories;
using Microsoft.AspNetCore.Http;

namespace Service_layer
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;
        private int _courseCounter = 0;
        private int _courseInstanceCounter = 0;
        private int _duplicateCourseInstance = 0;
        private int _lineNumError = 0;

        public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<List<CourseInstanceModel>> getCoursesByWeekAndYear(int week, int year)
        {
            //calculate start and enddate of week
            // https://stackoverflow.com/questions/662379/calculate-date-from-week-number
            DateTime jan1 = new DateTime(year, 1, 1);
            int daysOffset = DayOfWeek.Thursday - jan1.DayOfWeek;

            // Use first Thursday in January to get first week of the year as
            // it will never be in Week 52/53
            DateTime firstThursday = jan1.AddDays(daysOffset);
            var cal = CultureInfo.CurrentCulture.Calendar;
            int firstWeek = cal.GetWeekOfYear(firstThursday, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

            var weekNum = week;
            // As we're adding days to a date in Week 1,
            // we need to subtract 1 in order to get the right date for week #1
            if (firstWeek == 1)
            {
                weekNum -= 1;
            }

            // Using the first Thursday as starting week ensures that we are starting in the right year
            // then we add number of weeks multiplied with days
            var result = firstThursday.AddDays(weekNum * 7);

            // Subtract 3 days from Thursday to get Monday, which is the first weekday in ISO8601
            var firstWeekDay = result.AddDays(-3);
            var lastWeekDay = firstWeekDay.AddDays(6);


            //get courses

            var courseList = await _courseRepository.GetAllCoursesByStartAndEndDateAsync(firstWeekDay, lastWeekDay);

            //return
            return courseList;

        }

        public bool IsFileInCorrectFormat(IFormFile file)
        {
            if (file == null) { return false; }

            string line = string.Empty;
            _lineNumError = 0;

            using (var sr = new StreamReader(file.OpenReadStream()))
            {
                while ((line = sr.ReadLine()) != null)
                {
                    _lineNumError++;
                    while (line != string.Empty)
                    {
                        if (line.Split(": ")[0] != "Titel" && line.Split(": ").Length == 2)
                        {
                            return false;
                        }
                        line = sr.ReadLine();
                        _lineNumError++;
                        if (line.Split(": ")[0] != "Cursuscode" && line.Split(": ").Length == 2)
                        {
                            return false;
                        }
                        line = sr.ReadLine();
                        _lineNumError++;
                        if (line.Split(": ")[0] != "Duur" && line.Split(": ").Length == 2)
                        {
                            return false;
                        }
                        else
                        {
                            Regex regex = new Regex("[0-9]+\\sdagen", RegexOptions.IgnoreCase);
                            string days = line.Split(": ")[1];
                            if (!regex.IsMatch(days))
                            {
                                return false;
                            }
                        }
                        line = sr.ReadLine();
                        _lineNumError++;
                        if (line.Split(": ")[0] != "Startdatum" && line.Split(": ").Length == 2)
                        {
                            return false;
                        }
                        else
                        {
                            Regex regex = new Regex("([0-9]+(/[0-9]+)+)", RegexOptions.IgnoreCase);
                            string date = line.Split(": ")[1];
                            if (!regex.IsMatch(date))
                            {
                                return false;
                            }
                        }
                        line = sr.ReadLine();
                        _lineNumError++;
                        if (!string.IsNullOrEmpty(line) || !string.IsNullOrWhiteSpace(line))
                        {
                            return false;
                        }
                        if (line == null)
                        {
                            return true;
                        }
                    }
                }
                sr.Close();
            }

            return true;
        }

        public List<FileObject> handleFormFile(IFormFile file)
        {
            List<FileObject> fileObjects = new List<FileObject>();

            if (!IsFileInCorrectFormat(file))
            {
                throw new Exception("File is not in correct format");
            }

            string line = "";

            using (var sr = new StreamReader(file.OpenReadStream()))
            {
                while ((line = sr.ReadLine()) != null)
                {
                    FileObject temFileObject = new FileObject();

                    while (!string.IsNullOrEmpty(line))
                    {
                        switch (line.Split(": ")[0])
                        {
                            case "Titel":
                                temFileObject.Title = line.Split(": ")[1];
                                break;
                            case "Cursuscode":
                                temFileObject.CourseCode = line.Split(": ")[1];
                                break;
                            case "Duur":
                                temFileObject.AmountOfDays = int.Parse(line.Split(": ")[1].Split(" dagen")[0]) ;
                                break;
                            case "Startdatum":
                                temFileObject.startDate = DateTime.Parse(line.Split(": ")[1]);
                                break;
                            default:
                                throw new Exception("File is not correct");
                        }

                        line = sr.ReadLine();
                    }
                    fileObjects.Add(temFileObject);
                }
                sr.Close();
            }

            return fileObjects;
            throw new NotImplementedException();
        }

        public async Task<CourseModel> generateCourse(FileObject fileObject)
        {
            if (fileObject.AmountOfDays > 5)
            {
                throw new Exception("Cannot have a course with more than 5 days!");
            }

            CourseModel? course;
            course = await _courseRepository.GetCourseByCodeAsync(fileObject.CourseCode);


            if (course != null)
            {
                return course;
            }
            else
            {
                course = new CourseModel();
            }

            course.AmountOfDays = fileObject.AmountOfDays;
            course.Title = fileObject.Title;
            course.CourseCode = fileObject.CourseCode;

            var result = await _courseRepository.SaveCourseInDatabaseAsync(course);
            _courseCounter++;

            return result;
        }

        public async Task<CourseInstanceModel> generateCourseInstance(FileObject fileObject)
        {
            CourseInstanceModel? courseInstance;
            CourseModel? course;

            courseInstance =
                _courseRepository.GetCourseInstanceModelByDateAndCourseCode(fileObject.startDate,
                    fileObject.CourseCode);

            if (courseInstance != null)
            {
                this._duplicateCourseInstance++;
                return courseInstance;
            }
            else
            {
                courseInstance = new CourseInstanceModel();
            }

            courseInstance.StartDate = fileObject.startDate;
            course = await _courseRepository.GetCourseByCodeAsync(fileObject.CourseCode);
            
            if (course == null)
            {
                course = await generateCourse(fileObject);
            }


            courseInstance.Course = course;

            var result = await _courseRepository.SaveCourseInstanceInDatabaseAsync(courseInstance);
            _courseInstanceCounter++;

            return result;
        }

        public async Task<string> handleCourseCreationWithFile(IFormFile file, DateTime StartDate, DateTime EndDate)
        {
            _courseCounter = 0;
            _courseInstanceCounter = 0;
            _lineNumError = 0;

            if (!IsFileInCorrectFormat(file))
            {
                return $"File is not in the correct format, error on line {_lineNumError}";
            }

            List<FileObject> fileObjects = handleFormFile(file);
            

            foreach (var fileObject in fileObjects)
            {
                if (fileObject.startDate >= StartDate && fileObject.startDate <= EndDate)
                {
                    var result = await generateCourseInstance(fileObject);
                }
            }

            return $"Generated {_courseInstanceCounter} course instances and {_courseCounter} courses. Found {_duplicateCourseInstance} duplicate course instances!";
        }

        public async Task<CourseInstanceModel> GetCourseInstanceById(int id)
        {
            var result = await _courseRepository.GetCourseInstanceById(id);

            if (result == null)
            {
                throw new Exception("No course instance found");
            }

            return result;
            
        }
    }
}
