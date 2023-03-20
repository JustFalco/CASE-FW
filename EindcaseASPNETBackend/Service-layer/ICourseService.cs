using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Microsoft.AspNetCore.Http;

namespace Service_layer;

public interface ICourseService
{
    Task<List<CourseInstanceModel>> getCoursesByWeekAndYear(int week, int year);
    List<FileObject> handleFormFile(IFormFile file);
    Task<string> handleCourseCreationWithFile(IFormFile file, DateTime StartDate, DateTime EndDate);
}