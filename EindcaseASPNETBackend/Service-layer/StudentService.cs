using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Data_access_layer.Repositories;

namespace Service_layer
{
    public class StudentService : IStudentService
    {
        private readonly IStudentRepository _studentRepository;
        private readonly ICourseRepository _courseRepository;

        public StudentService(IStudentRepository studentRepository, ICourseRepository courseRepository)
        {
            _studentRepository = studentRepository;
            _courseRepository = courseRepository;
        }

        public async Task<StudentModel> CreateStudent(CreateStudentDTO studentDto)
        {
            //check if student exists
            StudentModel student;
            student = _studentRepository.GetStudentByNameAndId(studentDto.FirstName, studentDto.LastName);

            //create student if not
            if (student == null)
            {
                student = new StudentModel
                {
                    FirstName = studentDto.FirstName,
                    LastName = studentDto.LastName
                };

                //Save student in database
                student = await _studentRepository.SaveStudentAsync(student);
            }

            //get course instance
            CourseInstanceModel? courseInstance = await _courseRepository.GetCourseInstanceById(studentDto.CourseInstanceId);
            if (courseInstance == null)
            {
                throw new Exception("Trying to add student to non existing course instance");
            }

            //check if student is already attending course instance
            if (courseInstance.Students.Contains(student))
            {
                return student;
            }

            //check if course instance has less than 12 students
            //if not add student to course instance and save course instance
            if (courseInstance.Students.Count < 12)
            {
                courseInstance.Students.Add(student);
                await _courseRepository.SaveCourseInstanceInDatabaseAsync(courseInstance);
            }

            //return student
            return student;

            throw new NotImplementedException();

        }
    }
}
