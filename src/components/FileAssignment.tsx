import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { 
  UserPlus, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  User,
  Users,
  FileText
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  fileNo: string;
  clientId: string;
  clientName: string;
  outstanding: number;
  bankCollector: string;
  assignedAgent?: string;
  status: 'unassigned' | 'assigned';
  bank: string;
  productType: string;
  contactNumber?: string;
  address?: string;
}

interface Agent {
  id: string;
  name: string;
  email: string;
  assignedBanks: string[];
}

interface FileAssignmentProps {
  files: CustomerRecord[];
  agents: Agent[];
  onAssignFiles: (fileIds: string[], agentId: string) => void;
  onUnassignFiles: (fileIds: string[]) => void;
}

export function FileAssignment({ files, agents, onAssignFiles, onUnassignFiles }: FileAssignmentProps) {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'assigned' | 'unassigned'>('all');
  const [filterBank, setFilterBank] = useState<string>('all');
  const [bulkAction, setBulkAction] = useState<'assign' | 'unassign'>('assign');

  const filteredFiles = files.filter(file => {
    const matchesSearch = 
      file.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.fileNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.clientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.bankCollector.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || file.status === filterStatus;
    const matchesBank = filterBank === 'all' || file.bank === filterBank;
    
    return matchesSearch && matchesStatus && matchesBank;
  });

  const unassignedFiles = files.filter(file => file.status === 'unassigned');
  const assignedFiles = files.filter(file => file.status === 'assigned');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map(file => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles(prev => [...prev, fileId]);
    } else {
      setSelectedFiles(prev => prev.filter(id => id !== fileId));
    }
  };

  const handleBulkAssignment = () => {
    if (selectedFiles.length === 0) return;

    if (bulkAction === 'assign' && selectedAgent) {
      onAssignFiles(selectedFiles, selectedAgent);
    } else if (bulkAction === 'unassign') {
      onUnassignFiles(selectedFiles);
    }

    setSelectedFiles([]);
    setSelectedAgent('');
  };

  const getAgentsByBank = (bank: string) => {
    return agents.filter(agent => agent.assignedBanks.includes(bank));
  };

  const getStatusBadge = (status: string) => {
    return status === 'assigned' ? (
      <Badge className="bg-green-100 text-green-800">Assigned</Badge>
    ) : (
      <Badge variant="secondary">Unassigned</Badge>
    );
  };

  const uniqueBanks = [...new Set(files.map(file => file.bank))];

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-100">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Files</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{files.length}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-orange-500 to-orange-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-orange-100">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Unassigned</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{unassignedFiles.length}</span>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-green-500 to-green-600" />
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Assigned</h3>
            </div>
            <span className="text-2xl font-bold text-gray-900">{assignedFiles.length}</span>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Assignment Controls */}
      {selectedFiles.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedFiles.length} files selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Select value={bulkAction} onValueChange={(value: 'assign' | 'unassign') => setBulkAction(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="assign">Assign</SelectItem>
                    <SelectItem value="unassign">Unassign</SelectItem>
                  </SelectContent>
                </Select>

                {bulkAction === 'assign' && (
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} ({agent.assignedBanks.join(', ')})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                <Button 
                  onClick={handleBulkAssignment}
                  disabled={bulkAction === 'assign' && !selectedAgent}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  {bulkAction === 'assign' ? 'Assign' : 'Unassign'} Files
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterStatus} onValueChange={(value: 'all' | 'assigned' | 'unassigned') => setFilterStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterBank} onValueChange={setFilterBank}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Banks</SelectItem>
                {uniqueBanks.map(bank => (
                  <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchQuery('');
              setFilterStatus('all');
              setFilterBank('all');
              setSelectedFiles([]);
            }}>
              <Filter className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Files Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            File Assignment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>File Details</TableHead>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Outstanding</TableHead>
                  <TableHead>Bank Collector</TableHead>
                  <TableHead>Assigned Agent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow key={file.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={(checked) => handleSelectFile(file.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{file.fileNo}</p>
                        <p className="text-sm text-gray-500">
                          {file.bank} • {file.productType}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900">{file.clientName}</p>
                        <p className="text-sm text-gray-500">ID: {file.clientId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-red-600">
                        ৳{file.outstanding.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        {file.bankCollector}
                      </div>
                    </TableCell>
                    <TableCell>
                      {file.assignedAgent ? (
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-green-600" />
                          {file.assignedAgent}
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Not assigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(file.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {file.status === 'unassigned' ? (
                          <Select onValueChange={(agentId) => onAssignFiles([file.id], agentId)}>
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Assign" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAgentsByBank(file.bank).map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>
                                  {agent.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onUnassignFiles([file.id])}
                          >
                            Unassign
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredFiles.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}