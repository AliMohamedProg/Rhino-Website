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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Serilog; // Add this at the top with other using statements

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
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

//Dependency Injection
builder.Services.AddScoped(typeof(ITableRepository<>), typeof(TableRepository<>));
builder.Services.AddScoped<ICategory, CategoryService>();
builder.Services.AddScoped<IItem, ItemService>();
builder.Services.AddScoped<IOrder, OrderService>();
builder.Services.AddScoped<IOrderItem, OrderItemService>();
builder.Services.AddScoped<IReview, ReviewService>();
builder.Services.AddScoped<ISetting, SettingService>();
builder.Services.AddScoped<ISlider, SliderService>();
builder.Services.AddScoped<IImage, ImageService>();





builder.Host.UseSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
