import { Grid, Typography } from '@mui/material';
import { AdminPanelSettings, Person, Lock } from '@mui/icons-material';
import { StatsCard } from '../UserManagement.styles';
import type UserStatsCardsProps from '../../../models/user_management/UserStatsCardsProps';


export default function UserStatsCards({ users, isMobile = false }: UserStatsCardsProps) {
  const totalUsers = users.length;
  const adminUsers = users.filter(user => user.roles.includes('Admin')).length;
  const activeUsers = users.filter(user => user.isActive).length;
  const lockedUsers = totalUsers - activeUsers;

  const stats = [
    {
      icon: <Person sx={{ fontSize: 40, color: '#3b82f6' }} />,
      label: 'Total Users',
      value: totalUsers,
      color: '#3b82f6'
    },
    {
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: '#10b981' }} />,
      label: 'Administrators',
      value: adminUsers,
      color: '#10b981'
    },
    {
      icon: <Person sx={{ fontSize: 40, color: '#10b981' }} />,
      label: 'Active Users',
      value: activeUsers,
      color: '#10b981'
    },
    {
      icon: <Lock sx={{ fontSize: 40, color: '#ef4444' }} />,
      label: 'Locked Users',
      value: lockedUsers,
      color: '#ef4444'
    }
  ];

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <StatsCard>
            {stat.icon}
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mt: 1 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
              {stat.label}
            </Typography>
          </StatsCard>
        </Grid>
      ))}
    </Grid>
  );
}