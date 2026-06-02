using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence.Configurations;

public class NeuronLogConfiguration : IEntityTypeConfiguration<NeuronLog>
{
    public void Configure(EntityTypeBuilder<NeuronLog> builder)
    {
        builder.ToTable("neurons_logs");

        builder.HasKey(l => l.Id);
        builder.Property(l => l.Id).HasColumnName("id");
        builder.Property(l => l.NeuronId).HasColumnName("neuron_id");
        builder.Property(l => l.Action).HasColumnName("action").HasMaxLength(200).IsRequired();
        builder.Property(l => l.PotentialSnapshot).HasColumnName("potential_snapshot");
        builder.Property(l => l.CreatedAt).HasColumnName("created_at");

        builder.HasOne(l => l.Neuron)
            .WithMany(n => n.Logs)
            .HasForeignKey(l => l.NeuronId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(l => l.NeuronId);
    }
}
