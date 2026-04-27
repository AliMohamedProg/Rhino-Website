using System.Text;
using Apis.Services;
using AutoMapper;
using Bl.Contracts;
using Bl.Mapping;
using Bl.Services;
using BusinessLayer.Contracts;
using DAL.Context;
using DAL.Contracts;
using DAL.Repositories;
using DAL.UserModel;
using Domains;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Serilog; // Add this at the top with other using statements

var builder = WebApplication.CreateBuilder(args);
// إضافة CORS service
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("https://rhino-web-ffnf.vercel.app") // رابط الNext.js local dev
              .AllowAnyHeader()
              .AllowAnyMethod()
            .AllowCredentials(); // مهم لو بتستخدم cookies
    });
});
//********************************************************************
// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddSwaggerGen();

// Register AutoMapper and your mapping profile(s)
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>()); // registers profiles from Bl.Mapping

//Context
builder.Services.AddDbContext<WoodDecorContext>(options => 
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequireUppercase = true;
    options.User.RequireUniqueEmail = true;
}).AddEntityFrameworkStores<WoodDecorContext>();

Log.Logger = new LoggerConfiguration().WriteTo.Console().WriteTo.MSSqlServer(
    connectionString: builder.Configuration.GetConnectionString("DefaultConnection"),
    tableName: "Log",
    autoCreateSqlTable: true
).CreateLogger();

builder.Services.AddHttpContextAccessor();

//**************************************************************************************************************************************

// JWT Authentication Setup
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    // Token validation
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    // Read token from cookie if not in header
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (string.IsNullOrEmpty(context.Token))
            {
                // اسم الكوكي لازم يطابق اللي انت مخزنه في Login API
                var accessToken = context.Request.Cookies["AccessToken"];
                if (!string.IsNullOrEmpty(accessToken))
                {
                    context.Token = accessToken;
                }
            }
            return Task.CompletedTask;
        }
    };
});



//**************************************************************************************************************************************

//Dependency Injection
builder.Services.AddScoped(typeof(ITableRepository<>), typeof(TableRepository<>));
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<ICategory, CategoryService>();
builder.Services.AddScoped<IStyles, StylesService>();
builder.Services.AddScoped<IItem, ItemService>();
builder.Services.AddScoped<IOrder, OrderService>();
builder.Services.AddScoped<IOrderItem, OrderItemService>();
builder.Services.AddScoped<IReview, ReviewService>();
builder.Services.AddScoped<ISetting, SettingService>();
builder.Services.AddScoped<ISlider, SliderService>();
builder.Services.AddScoped<IImage, ImageService>();
builder.Services.AddScoped<ICart, CartService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IRefreshTokens, RefreshTokensService>();
builder.Services.AddSingleton<TokenService>();
builder.Services.AddHttpClient<IPaymobPayment, PaymobService>();
//**************************************************************************************************************************************

builder.Host.UseSerilog();

// Set WebRootPath if it's not set automatically
if (string.IsNullOrEmpty(builder.Environment.WebRootPath))
{
    builder.Environment.WebRootPath = Path.Combine(builder.Environment.ContentRootPath, "wwwroot");
}
if (!Directory.Exists(builder.Environment.WebRootPath))
{
    Directory.CreateDirectory(builder.Environment.WebRootPath);
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseRouting();
app.UseStaticFiles(); // Serve files from wwwroot
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "wwwroot", "uploads")),
    RequestPath = "/uploads",
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Origin", "*");
        ctx.Context.Response.Headers.Append("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    }
});
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.UseSwagger();
app.UseSwaggerUI();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
    var dbContext = services.GetRequiredService<WoodDecorContext>();

    // Apply migrations
    //await dbContext.Database.MigrateAsync();

    // Seed data
    await ContextConfig.seedDataAsync(dbContext, userManager, roleManager);
}

app.Run();

