using Backend.Data;
using Backend.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<BackendContext>();
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
builder.Services.AddControllers();
builder.Services.AddTransient<IUsersRepository, UsersRepository>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();

app.UseEndpoints(endpoints => {
    endpoints.MapControllers();
});

app.Run();
