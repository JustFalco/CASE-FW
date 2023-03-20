using Data_access_layer.Models;

namespace Data_access_layer.Repositories;

public interface ICourseRepository
{
    Task<List<CourseInstanceModel>> GetAllCoursesByStartAndEndDateAsync(DateTime startDate, DateTime endDate);
    Task<CourseModel> SaveCourseInDatabaseAsync(CourseModel course);
    Task<CourseInstanceModel> SaveCourseInstanceInDatabaseAsync(CourseInstanceModel courseInstance);
    Task<CourseModel?> GetCourseByCodeAsync(string courseCode);
}