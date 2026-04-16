using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Logging;

namespace DAL.Exceptions
{
    public class DataAccessExption : Exception
    {
        public DataAccessExption(Exception ex , string customMessage , ILogger logger)
        {
            logger.LogError($"The Exception: {ex.Message} \n Custom Message: {customMessage}");
        }
    }
}
