using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using NeuroGraph.Main.Data;
using EFCore.NamingConventions;
using Neurograph.Services;
using Interfaces;

// Garante ambiente Development quando rodado pelo dotnet ef (que não lê launchSettings).
if (Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") is null)
    Environment.SetEnvironmentVariable("ASPNETCORE_ENVIRONMENT", "Development");

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"))
    .UseSnakeCaseNamingConvention());
    
    
builder.Services.AddSingleton(new BehaviorSettings());
builder.Services.AddScoped<INeuronBehaviorService, NeuronBehaviorService>();
builder.Services.AddScoped<INeuronResetService, NeuronResetService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
