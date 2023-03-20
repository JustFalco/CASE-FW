using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data_access_layer.DTOs
{
    public class FileObject
    {
        public string Title { get; set; }
        public string CourseCode { get; set; }
        public int AmountOfDays { get;set; }
        public DateTime startDate { get; set; }
    }
}
