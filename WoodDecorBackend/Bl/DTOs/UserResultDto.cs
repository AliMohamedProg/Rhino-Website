using System;
using System.Collections.Generic;
using System.Text;

namespace Bl.DTOs
{
    public class UserResultDto
    {
            public bool Success { get; set; }
            public string Token { get; set; }
            public IEnumerable<string> Errors { get; set; }
        
    }
}
