using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbReview : BaseTable
{

    public string Review { get; set; } = null!;

    public int Rating { get; set; }

    public Guid UserId { get; set; }

    public Guid ProductId { get; set; }
  
}
