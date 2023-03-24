using Data_access_layer.DTOs;
using Data_access_layer.Models;

namespace Service_layer;

public interface IStudentService
{
    Task<CreateStudentPostResponse> CreateStudent(CreateStudentDTO studentDto);
}