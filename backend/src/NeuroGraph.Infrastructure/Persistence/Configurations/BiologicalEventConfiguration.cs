using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence.Configurations;

public class BiologicalEventConfiguration : IEntityTypeConfiguration<BiologicalEvent>
{
    public void Configure(EntityTypeBuilder<BiologicalEvent> builder)
    {
        builder.ToTable("biological_events");

        builder.HasKey(e => e.Id);
        builder.Property(e => e.Id).HasColumnName("id");
        builder.Property(e => e.NeuronId).HasColumnName("neuron_id");
        builder.Property(e => e.Type).HasColumnName("type").HasConversion<int>();
        builder.Property(e => e.Description).HasColumnName("description").HasMaxLength(500);
        builder.Property(e => e.OutcomeScore).HasColumnName("outcome_score");
        builder.Property(e => e.OccurredAt).HasColumnName("occurred_at");

        builder.HasOne(e => e.Neuron)
            .WithMany(n => n.Events)
            .HasForeignKey(e => e.NeuronId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(e => e.Type);
        builder.HasIndex(e => e.OccurredAt);
    }
}
