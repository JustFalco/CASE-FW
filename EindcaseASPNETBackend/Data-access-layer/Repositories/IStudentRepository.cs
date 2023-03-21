using Data_access_layer.Models;

namespace Data_access_layer.Repositories;

public interface IStudentRepository
{
    StudentModel? GetStudentByNameAndId(string firstName, string lastName);
    Task<StudentModel> SaveStudentAsync(StudentModel student);
}