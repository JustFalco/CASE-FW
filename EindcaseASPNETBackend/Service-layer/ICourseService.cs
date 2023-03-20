using Data_access_layer.Models;

namespace Service_layer;

public interface ICourseService
{
    Task<List<CourseInstanceModel>> getCoursesByWeekAndYear(int week, int year);
}