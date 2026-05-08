import { Brand } from '@/constants/theme';
import { StyleSheet } from 'react-native';

export const helpSupportStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
  },
  chatbotCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chatbotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chatbotAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  chatbotTextContainer: {
    flex: 1,
  },
  chatbotTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  chatbotDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  chatbotButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Brand.primaryFaded,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  chatbotButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  faqItem: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  faqIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Brand.primaryFaded,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  faqTextContainer: {
    flex: 1,
  },
  faqQuestion: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactLabel: {
    fontSize: 13,
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 15,
    fontWeight: '600',
  },
});
