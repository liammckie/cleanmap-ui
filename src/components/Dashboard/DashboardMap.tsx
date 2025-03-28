
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const DashboardMap = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Cleaning Locations Map</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center h-[calc(100%-60px)]">
        <p className="text-muted-foreground mb-4 text-center">
          The locations map has been moved to the Reports section
        </p>
        <Button 
          onClick={() => navigate('/reports')}
          className="flex items-center gap-2"
        >
          <ExternalLink className="h-4 w-4" />
          View Map in Reports
        </Button>
      </CardContent>
    </Card>
  );
};

export default DashboardMap;
