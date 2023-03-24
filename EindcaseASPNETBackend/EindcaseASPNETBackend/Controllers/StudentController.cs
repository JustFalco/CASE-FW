using Data_access_layer.DTOs;
using Microsoft.AspNetCore.Mvc;
using Service_layer;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EindcaseASPNETBackend.Controllers
{
    [Route("api/student")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly IStudentService _studentService;
        public StudentController(IStudentService studentService)
        {
            _studentService = studentService;
        }


        // POST api/<StudentController>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] CreateStudentDTO studentDto)
        {
            if (ModelState.IsValid)
            {
                var result = await _studentService.CreateStudent(studentDto);
                return Ok(result);
            }

            return BadRequest("Error");
        }

    }
}
