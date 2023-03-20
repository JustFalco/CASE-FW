using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Data_access_layer.Models
{
    public class StudentModel
    {
        public int Id { get; set; }

        [MaxLength(200)]
        public string FirstName { get; set; } = string.Empty;
        [MaxLength(200)]
        public string LastName { get; set; } = string.Empty;

        [JsonIgnore]
        public List<CourseInstanceModel> AttendingCourses { get; set; }
    }
}
