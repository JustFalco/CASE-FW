using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Data_access_layer.Models;

namespace Data_access_layer.DTOs
{
    public class CreateStudentPostResponse
    {
        public bool Succes { get; set; }
        public List<string> Errors { get; set; }
        public List<string> Messages { get; set; }
        public StudentModel CreatedStudent { get; set; }
    }
}
