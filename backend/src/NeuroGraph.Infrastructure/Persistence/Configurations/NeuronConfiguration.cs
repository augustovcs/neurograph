using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using NeuroGraph.Domain.Entities;

namespace NeuroGraph.Infrastructure.Persistence.Configurations;

public class NeuronConfiguration : IEntityTypeConfiguration<Neuron>
{
    public void Configure(EntityTypeBuilder<Neuron> builder)
    {
        builder.ToTable("neurons");

        builder.HasKey(n => n.Id);
        builder.Property(n => n.Id).HasColumnName("id");
        builder.Property(n => n.Label).HasColumnName("label").HasMaxLength(120).IsRequired();
        builder.Property(n => n.Status).HasColumnName("status").HasConversion<int>();
        builder.Property(n => n.MembranePotential).HasColumnName("membrane_potential");
        builder.Property(n => n.Threshold).HasColumnName("threshold");
        builder.Property(n => n.Generation).HasColumnName("generation");
        builder.Property(n => n.FireCount).HasColumnName("fire_count");
        builder.Property(n => n.PositionX).HasColumnName("position_x");
        builder.Property(n => n.PositionY).HasColumnName("position_y");
        builder.Property(n => n.CreatedAt).HasColumnName("created_at");
        builder.Property(n => n.LastFiredAt).HasColumnName("last_fired_at");
        builder.Property(n => n.DiedAt).HasColumnName("died_at");

        builder.HasIndex(n => n.Status);
    }
}
