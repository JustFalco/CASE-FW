using System.Reflection.Emit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace Data_access_layer.Contexts;

public class DefaultContext : DbContext
{
    private readonly IConfiguration _configuration;
    /*public DbSet<...model...> modelname { get; set; }*/

    private string dbConnectionString;

    public DefaultContext(IConfiguration configuration)
    {
        _configuration = configuration;
        dbConnectionString = _configuration.GetConnectionString("InMemConnection");
    }

    public DefaultContext(DbContextOptions<DefaultContext> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
        dbConnectionString = _configuration.GetConnectionString("InMemConnection");
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            optionsBuilder.UseInMemoryDatabase(databaseName: dbConnectionString);
        }
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        /*modelBuilder.ApplyConfiguration();*/
    }
}