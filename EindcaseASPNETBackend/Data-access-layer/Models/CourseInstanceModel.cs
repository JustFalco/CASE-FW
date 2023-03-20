using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Threading.Tasks;

namespace Data_access_layer.Models
{
    public class CourseInstanceModel
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public List<StudentModel> Students { get; set; }

        public int CourseId { get; set; }
        public CourseModel Course { get; set; }
    } 
}
