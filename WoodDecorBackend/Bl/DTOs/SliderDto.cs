using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class SliderDto : BaseDto
    {
        public string TitleAr { get; set; } = null!;
        public string TitleEn { get; set; } = null!;
        public string ImageUrl { get; set; } = null!;

    }
}
