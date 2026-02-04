using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class RefreshTokensDto : BaseDto
    {
        public string Token { get; set; }

        public string UserId { get; set; }

        public DateTime Expires { get; set; }
    }
}
