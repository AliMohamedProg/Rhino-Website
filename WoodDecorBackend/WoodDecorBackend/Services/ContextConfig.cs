using DAL.Context;
using DAL.UserModel;
using Microsoft.AspNetCore.Identity;
using Serilog.Sinks.MSSqlServer;

namespace Apis.Services
{
    public class ContextConfig
    {
        private readonly static string seedAdminEmail = "admin@gmail.com";
        public static async Task seedDataAsync(WoodDecorContext ctx, UserManager<ApplicationUser> user
            , RoleManager<IdentityRole> roleManager)
        {
            await seedUserAsync(ctx,roleManager,user);
        }
        private static async Task seedUserAsync(WoodDecorContext ctx, RoleManager<IdentityRole> roleManager
            , UserManager<ApplicationUser> user)
        {
            if (!await roleManager.RoleExistsAsync("Admin"))
            {
                await roleManager.CreateAsync(new IdentityRole("Admin"));
            }

            if (!await roleManager.RoleExistsAsync("User"))
            {
                await roleManager.CreateAsync(new IdentityRole("User"));
            }

            var adminEmail = seedAdminEmail;
            var adminUser = await user.FindByEmailAsync(adminEmail);
            if (adminUser == null)
            {
                var id = Guid.NewGuid().ToString();
                adminUser = new ApplicationUser
                {
                    Id = id,
                    UserName = adminEmail,
                    FirstName = "System", 
                    LastName = "Admin",   
                    Email = adminEmail,
                    EmailConfirmed = true,
                    PhoneNumberConfirmed = true
                };
                var result = await user.CreateAsync(adminUser, "Admin@123");
                await user.AddToRoleAsync(adminUser, "Admin");
            }
            else
            {
                // Ensure UserName matches Email for existing admin to allow login via email
                if (adminUser.UserName != adminUser.Email)
                {
                    adminUser.UserName = adminUser.Email;
                    await user.UpdateAsync(adminUser);
                }

                // Ensure Admin role is assigned
                if (!await user.IsInRoleAsync(adminUser, "Admin"))
                {
                    await user.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }
    }
}
