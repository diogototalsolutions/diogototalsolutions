import { PrismaClient, UserRole } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("Defina ADMIN_EMAIL e ADMIN_PASSWORD no ambiente para executar o seed.");
  }

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: UserRole.ADMIN,
      passwordHash: await hash(adminPassword, 10),
    },
    create: {
      email: adminEmail,
      name: "Administrador DTS",
      role: UserRole.ADMIN,
      passwordHash: await hash(adminPassword, 10),
    },
  });

  const services = [
    {
      name: "Desenvolvimento Web Empresarial",
      slug: "desenvolvimento-web-empresarial",
      description: "Construção de websites institucionais, landing pages e plataformas internas com foco no negócio.",
      category: "Web",
      basePrice: "1500",
    },
    {
      name: "Automação de Processos",
      slug: "automacao-de-processos",
      description: "Automação de tarefas repetitivas e integração de fluxos para ganho de eficiência operacional.",
      category: "Automação",
      basePrice: "1200",
    },
    {
      name: "Integrações e APIs",
      slug: "integracoes-e-apis",
      description: "Integração entre sistemas, ERPs, CRMs e APIs externas para unificar dados e operações.",
      category: "Integrações",
      basePrice: "1800",
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
