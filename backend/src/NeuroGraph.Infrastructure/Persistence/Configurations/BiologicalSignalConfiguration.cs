using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence.Configurations;

public class BiologicalSignalConfiguration : IEntityTypeConfiguration<BiologicalSignal>
{
    public void Configure(EntityTypeBuilder<BiologicalSignal> builder)
    {
        builder.ToTable("biological_signals");

        builder.HasKey(s => s.Id);
        builder.Property(s => s.Id).HasColumnName("id");
        builder.Property(s => s.NeuronId).HasColumnName("neuron_id");
        builder.Property(s => s.Type).HasColumnName("type").HasConversion<int>();
        builder.Property(s => s.Intensity).HasColumnName("intensity");
        builder.Property(s => s.CreatedAt).HasColumnName("created_at");

        builder.HasOne(s => s.Neuron)
            .WithMany(n => n.Signals)
            .HasForeignKey(s => s.NeuronId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
