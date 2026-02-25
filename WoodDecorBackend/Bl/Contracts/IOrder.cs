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
    public interface IOrder: IBaseService<TbOrder,OrderDto>
    {
        Task<TbOrder> CreateOrder(Guid userId, string Country, string City, string Address, decimal Total, string PhoneNumber, string Email, string FirstName, string LastName, string? transactionId = null);
        Task<List<OrderDto>> GetUserOrders(Guid userId);
        Task<OrderDto> GetOrderById(Guid id);
        Task<List<OrderDto>> GetAllOrders();
        Task<bool> UpdateOrderStatus(Guid orderId, string status);
        Task<bool> UpdateOrderPaymentStatus(Guid orderId, string transactionId, string status);
    }
}
