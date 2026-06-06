import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@vendorbridge/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.invoice.deleteMany({});
  await prisma.goodReceiptItem.deleteMany({});
  await prisma.goodReceipt.deleteMany({});
  await prisma.poAttachment.deleteMany({});
  await prisma.poItem.deleteMany({});
  await prisma.purchaseOrder.deleteMany({});
  await prisma.approval.deleteMany({});
  await prisma.quotationAttachment.deleteMany({});
  await prisma.quotationItem.deleteMany({});
  await prisma.quotation.deleteMany({});
  await prisma.rfqAttachment.deleteMany({});
  await prisma.rfqItem.deleteMany({});
  await prisma.rfq.deleteMany({});
  await prisma.vendorDocument.deleteMany({});
  await prisma.vendorContact.deleteMany({});
  await prisma.vendor.deleteMany({});
  await prisma.user.deleteMany({});

  // Create admin user
  const adminPassword = await hashPassword('Admin@123456');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@vendorbridge.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      emailVerified: true,
      isActive: true,
    },
  });

  // Create procurement officer
  const procurePassword = await hashPassword('Procure@123456');
  const procurementOfficer = await prisma.user.create({
    data: {
      email: 'procure@vendorbridge.com',
      password: procurePassword,
      firstName: 'Procurement',
      lastName: 'Officer',
      role: 'PROCUREMENT_OFFICER',
      emailVerified: true,
      isActive: true,
    },
  });

  // Create manager
  const managerPassword = await hashPassword('Manager@123456');
  const manager = await prisma.user.create({
    data: {
      email: 'manager@vendorbridge.com',
      password: managerPassword,
      firstName: 'Manager',
      lastName: 'User',
      role: 'MANAGER',
      emailVerified: true,
      isActive: true,
    },
  });

  // Create vendors
  const vendorPassword = await hashPassword('Vendor@123456');
  
  const vendor1User = await prisma.user.create({
    data: {
      email: 'vendor1@example.com',
      password: vendorPassword,
      firstName: 'Vendor',
      lastName: 'One',
      role: 'VENDOR',
      emailVerified: true,
      isActive: true,
    },
  });

  const vendor1 = await prisma.vendor.create({
    data: {
      userId: vendor1User.id,
      name: 'TechSupply Corp',
      email: 'vendor1@example.com',
      phone: '+91-9876543210',
      website: 'https://techsupply.com',
      gstNumber: '18AABCT1234H1Z0',
      panNumber: 'ABCPT1234K',
      category: 'MANUFACTURING',
      addressLine1: '123 Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'India',
      rating: 4.5,
    },
  });

  const vendor2User = await prisma.user.create({
    data: {
      email: 'vendor2@example.com',
      password: vendorPassword,
      firstName: 'Vendor',
      lastName: 'Two',
      role: 'VENDOR',
      emailVerified: true,
      isActive: true,
    },
  });

  const vendor2 = await prisma.vendor.create({
    data: {
      userId: vendor2User.id,
      name: 'Global Supplies Ltd',
      email: 'vendor2@example.com',
      phone: '+91-9876543211',
      website: 'https://globalsupplies.com',
      gstNumber: '27AABCT5678H1Z0',
      panNumber: 'ABCPT5678K',
      category: 'DISTRIBUTION',
      addressLine1: '456 Commerce Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400001',
      country: 'India',
      rating: 4.2,
    },
  });

  // Create RFQ
  const rfq = await prisma.rfq.create({
    data: {
      rfqNumber: 'RFQ-000001',
      title: 'Request for Server Hardware',
      description: 'We need to procure high-performance servers for our data center expansion',
      status: 'PUBLISHED',
      createdById: procurementOfficer.id,
      publishDate: new Date(),
      deadlineDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      vendors: {
        connect: [
          { id: vendor1.id },
          { id: vendor2.id },
        ],
      },
      items: {
        createMany: {
          data: [
            {
              productName: 'Server - Dell PowerEdge R750',
              description: 'Dual socket Xeon processor, 2TB RAM, 10TB Storage',
              quantity: 5,
              unit: 'Units',
              estimatedPrice: 450000,
            },
            {
              productName: 'Network Switch - Cisco Nexus 9300',
              description: '48 port 100G switch',
              quantity: 2,
              unit: 'Units',
              estimatedPrice: 180000,
            },
          ],
        },
      },
    },
  });

  console.log('Database seed completed successfully!');
  console.log('\nDefault Credentials:');
  console.log('Admin: admin@vendorbridge.com / Admin@123456');
  console.log('Procurement: procure@vendorbridge.com / Procure@123456');
  console.log('Manager: manager@vendorbridge.com / Manager@123456');
  console.log('Vendor 1: vendor1@example.com / Vendor@123456');
  console.log('Vendor 2: vendor2@example.com / Vendor@123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
