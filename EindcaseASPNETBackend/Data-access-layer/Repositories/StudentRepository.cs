using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.Contexts;
using Data_access_layer.Models;

namespace Data_access_layer.Repositories
{
    public class StudentRepository : IStudentRepository
    {
        private readonly CourseContext _courseContext;
        public StudentRepository(CourseContext courseContext)
        {
            _courseContext = courseContext;
        }

        public StudentModel? GetStudentByNameAndId(string firstName, string lastName)
        {
            return _courseContext.Students.Where(s => s.FirstName == firstName && s.LastName == lastName).ToList().FirstOrDefault(defaultValue:null);
        }

        public async Task<StudentModel> SaveStudentAsync(StudentModel student)
        {
            _courseContext.Students.Add(student);
            await _courseContext.SaveChangesAsync();

            return student;
        }
    }
}
