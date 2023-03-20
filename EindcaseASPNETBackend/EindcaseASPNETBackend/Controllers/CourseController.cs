using Data_access_layer.DTOs;
using Microsoft.AspNetCore.Mvc;
using Service_layer;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace EindcaseASPNETBackend.Controllers
{
    [Route("api/courses")]
    [ApiController]
    public class CourseController : ControllerBase
    {
        private readonly ICourseService _courseService;

        public CourseController(ICourseService courseService)
        {
            _courseService = courseService;
        }

        // GET: api/<CourseController>
        [HttpGet]
        public async Task<IActionResult> GetCoursesByWeekAndYear(int week, int year)
        {
            if (week > 0 && week < 54 && year > 1900 && year < 10000)
            {
                var dbResult = await _courseService.getCoursesByWeekAndYear(week, year);
                return Ok(dbResult);
            }

            return BadRequest("It seems like you gave the wrong input");
        }

        // GET api/<CourseController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<CourseController>
        [HttpPost]
        public async Task<string> Post(IFormFile file,[FromQuery] DateTime StartDate,[FromQuery] DateTime EndDate)
        {
            if (file.Length > 0)
            {
                var result = await _courseService.handleCourseCreationWithFile(file, StartDate, EndDate);
                return result;
            }

            return "There were errors";
        }

        // PUT api/<CourseController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<CourseController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
