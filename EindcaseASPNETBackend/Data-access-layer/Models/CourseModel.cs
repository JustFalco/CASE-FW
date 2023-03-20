using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_access_layer.Models
{
    public class CourseModel
    {
        
        public int Id { get; set; }

        public string CourseCode { get; set; }

        public string Title { get; set; }
        public int AmountOfDays { get; set; }

    }
}
