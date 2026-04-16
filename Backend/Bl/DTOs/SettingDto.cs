using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class SettingDto : BaseDto
    {
        public string? LogoUrl { get; set; }

        public string? FacebookLink { get; set; }

        public string? InstagramLink { get; set; }

        public string? TikTokLink { get; set; }
    }
}
