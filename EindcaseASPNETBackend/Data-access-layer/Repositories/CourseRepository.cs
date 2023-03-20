using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.Contexts;
using Data_access_layer.Models;
using Microsoft.EntityFrameworkCore;

namespace Data_access_layer.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        private readonly CourseContext _courseContext;

        public CourseRepository(CourseContext courseContext)
        {
            _courseContext = courseContext;
        }

        public async Task<List<CourseInstanceModel>> GetAllCoursesByStartAndEndDateAsync(DateTime startDate, DateTime endDate)
        {
            return _courseContext.CourseInstances
                .Where(c => c.StartDate  >= startDate && c.StartDate <= endDate)
                .Include(c => c.Course)
                .Include(c => c.Students)
                .OrderBy(c => c.StartDate)
                .ToList();
        }

        public async Task<CourseModel> SaveCourseInDatabaseAsync(CourseModel course)
        {
            if (GetCourseByCodeAsync(course.CourseCode) != null)
            {
                return course;
            }

            _courseContext.Courses.Add(course);
            await _courseContext.SaveChangesAsync();

            return course;
        }

        public async Task<CourseInstanceModel> SaveCourseInstanceInDatabaseAsync(CourseInstanceModel courseInstance)
        {
            _courseContext.CourseInstances.Add(courseInstance);
            await _courseContext.SaveChangesAsync();

            return courseInstance;
        }

        public async Task<CourseModel?> GetCourseByCodeAsync(string courseCode)
        {
            return _courseContext.Courses.Where(c => c.CourseCode == courseCode).ToList().FirstOrDefault(defaultValue: null);
        }
    }
}
