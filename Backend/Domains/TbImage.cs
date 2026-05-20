using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbImage:BaseTable
{
    public Guid Id { get; set; }

    public string ImageUrl { get; set; } = null!;

    public Guid ProductId { get; set; }

    public virtual TbItem Product { get; set; } = null!;
}
