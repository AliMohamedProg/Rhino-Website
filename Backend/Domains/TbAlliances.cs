using System;
using System.Collections.Generic;

namespace Domains;

public partial class TbAlliances : BaseTable
{

    public string Name { get; set; } = null!;

    public string ImageUrl { get; set; } = null!;
    
    // Nav property
    public ICollection<TbProjects> Projects { get; set; } = new List<TbProjects>();
}
