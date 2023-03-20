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
                .ToList();
        }
    }
}
