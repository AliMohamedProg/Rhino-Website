using Bl.DTOs;

namespace Bl.Contracts
{
    public interface IPaymobPayment
    {
        Task<PaymobPaymentResult> CreatePayment(
            int amount,
            string email,
            string firstName,
            string lastName,
            string phone,
            string orderId,
            string paymentMethod);

        Task<bool> Refund(string transactionId, decimal amount);
    }
}
