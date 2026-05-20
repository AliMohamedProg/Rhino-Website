using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Domains;

public partial class TbItemFabrics:BaseTable
{
    public string Name { get; set; }
    public string ImageUrl { get; set; } = null!;

    public Guid ProductId { get; set; }

    public virtual TbItem Product { get; set; } = null!;
}