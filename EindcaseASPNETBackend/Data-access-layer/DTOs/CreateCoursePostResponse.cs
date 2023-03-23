using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_access_layer.DTOs
{
    public class CreateCoursePostResponse
    {
        public bool Succes { get; set; }
        public List<string> Errors { get; set; }
        public List<string> Messages { get; set; }

        public int CreatedCourses { get; set; }
        public int CreatedCourseInstances { get; set; }
        public int DuplicateCourseInstances { get; set; }
        public int LineNrError { get; set; }
    }
}
