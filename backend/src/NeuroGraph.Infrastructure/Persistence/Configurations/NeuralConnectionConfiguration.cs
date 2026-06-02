using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence.Configurations;

public class NeuralConnectionConfiguration : IEntityTypeConfiguration<NeuralConnection>
{
    public void Configure(EntityTypeBuilder<NeuralConnection> builder)
    {
        builder.ToTable("neural_connections");

        builder.HasKey(c => c.Id);
        builder.Property(c => c.Id).HasColumnName("id");
        builder.Property(c => c.SourceNeuronId).HasColumnName("source_neuron_id");
        builder.Property(c => c.TargetNeuronId).HasColumnName("target_neuron_id");
        builder.Property(c => c.Weight).HasColumnName("weight");
        builder.Property(c => c.IsActive).HasColumnName("is_active");
        builder.Property(c => c.CreatedAt).HasColumnName("created_at");

        builder.HasOne(c => c.Source)
            .WithMany(n => n.OutgoingConnections)
            .HasForeignKey(c => c.SourceNeuronId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(c => c.Target)
            .WithMany(n => n.IncomingConnections)
            .HasForeignKey(c => c.TargetNeuronId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(c => new { c.SourceNeuronId, c.TargetNeuronId }).IsUnique();
    }
}
