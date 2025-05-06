import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Card, Title, Text, TextInput, Paragraph, ProgressBar } from 'react-native-paper';

// Mock functions to simulate document OCR
const mockProcessDocument = async (uri: string, documentType: string) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Return mock data based on document type
  if (documentType === 'NRIC') {
    return {
      id: 'doc-' + Math.random().toString(36).substring(2, 10),
      type: documentType,
      status: 'completed',
      extractedData: {
        fullName: "TAN LAUREN",
        nric: "S9012345A",
        dob: "1990-05-10",
        gender: "FEMALE",
        address: "123 ORCHARD ROAD #12-34 SINGAPORE 238883"
      },
      confidence: 0.95
    };
  } else if (documentType === 'Income') {
    return {
      id: 'doc-' + Math.random().toString(36).substring(2, 10),
      type: documentType,
      status: 'completed',
      extractedData: {
        employer: "ACME TECH PTE LTD",
        income: 5500,
        period: "JAN 2023"
      },
      confidence: 0.92
    };
  }
  
  return {
    id: 'doc-' + Math.random().toString(36).substring(2, 10),
    type: documentType,
    status: 'failed',
    error: 'Could not process document'
  };
};

export default function ApplyScreen() {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(1);
  const [processingDocument, setProcessingDocument] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nric: '',
    address: '',
    employmentStatus: '',
    monthlyIncome: '',
    loanAmount: '',
    loanPurpose: '',
  });
  
  const totalSteps = 4;
  
  const handleNextStep = () => {
    if (currentStep === totalSteps) {
      // Form completed, navigate to offers
      navigation.navigate('Offers' as never);
      return;
    }
    
    // Validate current step
    if (currentStep === 1 && !validatePersonalInfo()) {
      Alert.alert('Missing Information', 'Please fill out all required fields.');
      return;
    }
    
    if (currentStep === 2 && documents.length < 2) {
      Alert.alert('Required Documents', 'Please upload all required documents.');
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const validatePersonalInfo = () => {
    const requiredFields = ['fullName', 'email', 'phone', 'nric'];
    return requiredFields.every(field => formData[field as keyof typeof formData]);
  };
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleUploadDocument = async (documentType: string) => {
    // In a real app, this would open the camera or file picker
    setProcessingDocument(true);
    
    try {
      // Mock uploading and processing a document with OCR
      Alert.alert('Document Upload', 'Simulating document upload and OCR processing...');
      
      // Simulate uploading an image file
      const mockImageUri = 'https://example.com/document.jpg';
      
      // Process the document with OCR
      const result = await mockProcessDocument(mockImageUri, documentType);
      
      // Update documents state
      if (result.status === 'completed') {
        setDocuments(prev => {
          // Remove any existing document of the same type
          const filtered = prev.filter(doc => doc.type !== documentType);
          return [...filtered, result];
        });
        
        // If OCR extraction was successful, update form data
        if (result.extractedData) {
          setFormData(prev => ({
            ...prev,
            ...result.extractedData
          }));
          
          Alert.alert(
            'Document Processed',
            `Successfully extracted information with ${Math.round(result.confidence * 100)}% confidence.`
          );
        }
      } else {
        Alert.alert('Processing Failed', result.error || 'Could not process document.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing the document.');
    } finally {
      setProcessingDocument(false);
    }
  };
  
  const renderStepIndicator = () => {
    const progress = currentStep / totalSteps;
    
    return (
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} color="#0051CC" style={styles.progressBar} />
        <Text style={styles.progressText}>Step {currentStep} of {totalSteps}</Text>
      </View>
    );
  };
  
  const renderPersonalInfoStep = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.stepTitle}>Personal Information</Title>
          
          <TextInput
            label="Full Name *"
            value={formData.fullName}
            onChangeText={value => handleInputChange('fullName', value)}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email Address *"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            style={styles.input}
            keyboardType="email-address"
            mode="outlined"
          />
          
          <TextInput
            label="Phone Number *"
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
            mode="outlined"
          />
          
          <TextInput
            label="NRIC/FIN *"
            value={formData.nric}
            onChangeText={value => handleInputChange('nric', value)}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Home Address"
            value={formData.address}
            onChangeText={value => handleInputChange('address', value)}
            style={styles.input}
            multiline
            numberOfLines={2}
            mode="outlined"
          />
        </Card.Content>
      </Card>
    );
  };
  
  const renderDocumentsStep = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.stepTitle}>Required Documents</Title>
          <Paragraph style={styles.stepDescription}>
            Upload the following documents to verify your identity and income.
            Our OCR system will automatically extract information to speed up your application.
          </Paragraph>
          
          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Identity Verification</Text>
            <Paragraph style={styles.documentDescription}>
              Upload your NRIC or Passport
            </Paragraph>
            
            {documents.find(doc => doc.type === 'NRIC') ? (
              <View style={styles.uploadedDocument}>
                <Text style={styles.uploadedDocumentText}>
                  NRIC uploaded and processed
                </Text>
                <Button mode="text" onPress={() => handleUploadDocument('NRIC')}>
                  Re-upload
                </Button>
              </View>
            ) : (
              <Button 
                mode="outlined"
                onPress={() => handleUploadDocument('NRIC')}
                loading={processingDocument}
                disabled={processingDocument}
                style={styles.uploadButton}
              >
                Upload NRIC
              </Button>
            )}
          </View>
          
          <View style={styles.documentContainer}>
            <Text style={styles.documentTitle}>Income Verification</Text>
            <Paragraph style={styles.documentDescription}>
              Upload your latest payslip or income statement
            </Paragraph>
            
            {documents.find(doc => doc.type === 'Income') ? (
              <View style={styles.uploadedDocument}>
                <Text style={styles.uploadedDocumentText}>
                  Income document uploaded and processed
                </Text>
                <Button mode="text" onPress={() => handleUploadDocument('Income')}>
                  Re-upload
                </Button>
              </View>
            ) : (
              <Button 
                mode="outlined"
                onPress={() => handleUploadDocument('Income')}
                loading={processingDocument}
                disabled={processingDocument}
                style={styles.uploadButton}
              >
                Upload Income Document
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderLoanDetailsStep = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.stepTitle}>Loan Details</Title>
          
          <TextInput
            label="Employment Status *"
            value={formData.employmentStatus}
            onChangeText={value => handleInputChange('employmentStatus', value)}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Monthly Income *"
            value={formData.monthlyIncome}
            onChangeText={value => handleInputChange('monthlyIncome', value)}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
            left={<TextInput.Affix text="$" />}
          />
          
          <TextInput
            label="Loan Amount *"
            value={formData.loanAmount}
            onChangeText={value => handleInputChange('loanAmount', value)}
            style={styles.input}
            keyboardType="numeric"
            mode="outlined"
            left={<TextInput.Affix text="$" />}
          />
          
          <TextInput
            label="Loan Purpose *"
            value={formData.loanPurpose}
            onChangeText={value => handleInputChange('loanPurpose', value)}
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>
    );
  };
  
  const renderReviewStep = () => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.stepTitle}>Review Your Application</Title>
          <Paragraph style={styles.stepDescription}>
            Please review your application details before submitting.
          </Paragraph>
          
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Personal Information</Text>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>Full Name:</Text>
              <Text style={styles.reviewItemValue}>{formData.fullName}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>NRIC/FIN:</Text>
              <Text style={styles.reviewItemValue}>{formData.nric}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>Contact:</Text>
              <Text style={styles.reviewItemValue}>{formData.email}, {formData.phone}</Text>
            </View>
          </View>
          
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Loan Details</Text>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>Amount:</Text>
              <Text style={styles.reviewItemValue}>${formData.loanAmount}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>Purpose:</Text>
              <Text style={styles.reviewItemValue}>{formData.loanPurpose}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewItemLabel}>Monthly Income:</Text>
              <Text style={styles.reviewItemValue}>${formData.monthlyIncome}</Text>
            </View>
          </View>
          
          <View style={styles.reviewSection}>
            <Text style={styles.reviewSectionTitle}>Documents</Text>
            <Text style={styles.reviewItemValue}>
              {documents.length} documents uploaded and verified
            </Text>
          </View>
        </Card.Content>
      </Card>
    );
  };
  
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderDocumentsStep();
      case 3:
        return renderLoanDetailsStep();
      case 4:
        return renderReviewStep();
      default:
        return null;
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      {renderStepIndicator()}
      
      {renderCurrentStep()}
      
      <View style={styles.buttonContainer}>
        {currentStep > 1 && (
          <Button 
            mode="outlined" 
            onPress={handlePreviousStep}
            style={styles.button}
          >
            Previous
          </Button>
        )}
        
        <Button 
          mode="contained" 
          onPress={handleNextStep}
          style={[styles.button, styles.primaryButton]}
        >
          {currentStep === totalSteps ? 'Submit Application' : 'Next'}
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
  card: {
    margin: 16,
  },
  stepTitle: {
    marginBottom: 16,
  },
  stepDescription: {
    marginBottom: 16,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: '#0051CC',
  },
  documentContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  documentDescription: {
    marginBottom: 16,
    color: '#666',
  },
  uploadButton: {
    borderStyle: 'dashed',
  },
  uploadedDocument: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#e6f0ff',
    padding: 12,
    borderRadius: 4,
  },
  uploadedDocumentText: {
    color: '#0051CC',
  },
  reviewSection: {
    marginBottom: 24,
  },
  reviewSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  reviewItemLabel: {
    width: 120,
    fontWeight: 'bold',
    color: '#666',
  },
  reviewItemValue: {
    flex: 1,
  },
}); 