using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Data_access_layer.Models
{
    [PrimaryKey(nameof(FirstName), nameof(LastName))]
    public class StudentModel
    {
        [MaxLength(200)]
        public string FirstName { get; set; }
        [MaxLength(200)]
        public string LastName { get; set; }

        [JsonIgnore]
        public List<CourseInstanceModel> AttendingCourses { get; set; }
    }
}
