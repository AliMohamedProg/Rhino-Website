using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bl.Contracts;
using Bl.DTOs;
using Domains;

namespace BusinessLayer.Contracts
{
    public interface IItem: IBaseService<TbItem,ItemDto>
    {
        bool AddItemWithImages(ItemDto itemDto);
        bool UpdateItemWithImages(ItemDto itemDto);
        List<ItemDto> GetAllItemsWithImages();
        ItemDto? GetItemWithImages(Guid id);
    }
}
