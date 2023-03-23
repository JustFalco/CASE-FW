using Data_access_layer.DTOs;
using Data_access_layer.Models;
using Microsoft.AspNetCore.Http;

namespace Service_layer;

public interface ICourseService
{
    Task<List<CourseInstanceModel>> getCoursesByWeekAndYear(int week, int year);
    bool IsFileInCorrectFormat(IFormFile file);
    List<FileObject> handleFormFile(IFormFile file);
    Task<CreateCoursePostResponse> handleCourseCreationWithFile(IFormFile file, DateTime StartDate, DateTime EndDate);
    Task<CourseInstanceModel> GetCourseInstanceById(int id);
}