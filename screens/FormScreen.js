import React from 'react';
import { View, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { TextInput, Button, Checkbox, Text } from 'react-native-paper';
import { Formik } from 'formik';
import * as Yup from 'yup';

const FormScreen = () => {
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Jméno je povinné'),
    lastName: Yup.string().required('Příjmení je povinné'),
    phone: Yup.string().required('Telefon je povinný'),
    email: Yup.string().email('Neplatný e-mail').required('E-mail je povinný'),
    experience: Yup.number().min(0, 'Minimální hodnota je 0').required('Praxe je povinná'),
    consent: Yup.boolean().oneOf([true], 'Musíte souhlasit se zpracováním osobních údajů'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      // Vytvoření testovacích dat pro e-mail
      const emailData = {
        from_name: `${values.firstName} ${values.lastName}`,
        from_email: values.email,
        phone: values.phone,
        address: values.address || 'Nevyplněno',
        experience: values.experience,
        start_date: values.startDate || 'Nevyplněno',
        destinations: values.destinations.length > 0 ? values.destinations.join(', ') : 'Žádné vybrané destinace',
        note: values.note || 'Bez poznámky'
      };

      // Výpis dat do konzole pro testování
      console.log('ODESLANÁ DATA:');
      console.log('------------------');
      Object.entries(emailData).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });

      // Zobrazení dat v alertu pro testování
      Alert.alert(
        'Test odeslání',
        `Formulář byl úspěšně otestován!\n\nOdeslaná data:\n
        Jméno: ${emailData.from_name}
        Email: ${emailData.from_email}
        Telefon: ${emailData.phone}
        Adresa: ${emailData.address}
        Praxe: ${emailData.experience} let
        Nástup: ${emailData.start_date}
        Destinace: ${emailData.destinations}
        Poznámka: ${emailData.note}`,
        [
          { 
            text: 'OK', 
            onPress: () => {
              resetForm();
              console.log('Formulář byl resetován');
            }
          }
        ]
      );

    } catch (error) {
      Alert.alert(
        'Chyba',
        'Při testování formuláře došlo k chybě.',
        [{ text: 'OK' }]
      );
      console.error('Chyba při testování:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={true}
      >
        <Formik
          initialValues={{
            firstName: '',
            lastName: '',
            address: '',
            phone: '',
            email: '',
            experience: '',
            startDate: '',
            destinations: [],
            trailerTypes: [],
            note: '',
            consent: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            values,
            errors,
            touched,
          }) => (
            <View style={styles.formContainer}>
              <Text style={styles.title}>Poptávka řidiče C+E</Text>
              <Text style={styles.subtitle}>Mapler s.r.o.</Text>

              {/* Personal Details */}
              <TextInput
                label="Jméno *"
                onChangeText={handleChange('firstName')}
                onBlur={handleBlur('firstName')}
                value={values.firstName}
                style={styles.input}
                error={touched.firstName && errors.firstName}
              />
              {touched.firstName && errors.firstName && (
                <Text style={styles.error}>{errors.firstName}</Text>
              )}

              <TextInput
                label="Příjmení *"
                onChangeText={handleChange('lastName')}
                onBlur={handleBlur('lastName')}
                value={values.lastName}
                style={styles.input}
                error={touched.lastName && errors.lastName}
              />
              {touched.lastName && errors.lastName && (
                <Text style={styles.error}>{errors.lastName}</Text>
              )}

              <TextInput
                label="Adresa"
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                style={styles.input}
              />

              <TextInput
                label="Telefon *"
                onChangeText={handleChange('phone')}
                onBlur={handleBlur('phone')}
                value={values.phone}
                style={styles.input}
                keyboardType="phone-pad"
                error={touched.phone && errors.phone}
              />
              {touched.phone && errors.phone && (
                <Text style={styles.error}>{errors.phone}</Text>
              )}

              <TextInput
                label="E-mail *"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                style={styles.input}
                keyboardType="email-address"
                error={touched.email && errors.email}
              />
              {touched.email && errors.email && (
                <Text style={styles.error}>{errors.email}</Text>
              )}

              {/* License and Experience */}
              <Checkbox.Item
                label="Potvrzuji vlastnictví ŘP skupiny C+E"
                status={values.consent ? 'checked' : 'unchecked'}
                onPress={() => setFieldValue('consent', !values.consent)}
                style={styles.checkbox}
              />
              {touched.consent && errors.consent && (
                <Text style={styles.error}>{errors.consent}</Text>
              )}

              <TextInput
                label="Počet let praxe v MKD (C+E) *"
                onChangeText={handleChange('experience')}
                onBlur={handleBlur('experience')}
                value={values.experience}
                style={styles.input}
                keyboardType="numeric"
                error={touched.experience && errors.experience}
              />
              {touched.experience && errors.experience && (
                <Text style={styles.error}>{errors.experience}</Text>
              )}

              <TextInput
                label="Možný termín nástupu"
                onChangeText={handleChange('startDate')}
                onBlur={handleBlur('startDate')}
                value={values.startDate}
                style={styles.input}
              />

              {/* Preferences */}
              <Text style={styles.sectionTitle}>Preferované destinace (možno vybrat více):</Text>
              <Checkbox.Item
                label="Španělsko"
                status={values.destinations.includes('Španělsko') ? 'checked' : 'unchecked'}
                onPress={() => {
                  const destinations = [...values.destinations];
                  if (destinations.includes('Španělsko')) {
                    setFieldValue(
                      'destinations',
                      destinations.filter((d) => d !== 'Španělsko')
                    );
                  } else {
                    destinations.push('Španělsko');
                    setFieldValue('destinations', destinations);
                  }
                }}
                style={styles.checkbox}
              />

              <TextInput
                label="Poznámka / Doplňující informace"
                onChangeText={handleChange('note')}
                onBlur={handleBlur('note')}
                value={values.note}
                style={[styles.input, styles.multilineInput]}
                multiline
                numberOfLines={4}
              />

              <Button 
                mode="contained" 
                onPress={handleSubmit} 
                style={styles.button}
                contentStyle={styles.buttonContent}
              >
                Odeslat poptávku (TEST)
              </Button>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    marginBottom: 8,
    backgroundColor: 'white',
  },
  multilineInput: {
    height: 100,
  },
  checkbox: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 4,
  },
  button: {
    marginTop: 24,
    marginBottom: 32,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  error: {
    color: '#DC2626',
    fontSize: 12,
    marginBottom: 8,
    marginTop: -4,
    paddingHorizontal: 8,
  },
});

export default FormScreen;