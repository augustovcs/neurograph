using Microsoft.EntityFrameworkCore;
using Npgsql.EntityFrameworkCore.PostgreSQL;
using NeuroGraph.Main.Data;
using EFCore.NamingConventions;
using NeuroGraph.Main.Interfaces;
using NeuroGraph.Main.Services;

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
builder.Services.AddScoped<INeuronGenerationService, NeuronGenerationService>();
builder.Services.AddCors(o => o.AddPolicy("web", p =>
    p.WithOrigins("http://localhost:5173")   // porta do Vite
     .AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();

app.UseCors("web");

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
