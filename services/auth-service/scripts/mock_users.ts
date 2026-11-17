import dotenv from "dotenv";
import { Client } from "pg";
import type { UserRole } from "../src/constants/user.constants.js";

dotenv.config({
    path: "../.env"
});

const doctorLicenses = [
    { licenseNumber: "KL-MCI-2024-10001", email: "arjun.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10002", email: "meera.menon@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10003", email: "rahul.varma@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10004", email: "anjali.krishnan@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10005", email: "vivek.pillai@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10006", email: "neha.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10007", email: "rohit.menon@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10008", email: "kavya.radhakrishnan@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10009", email: "adithya.kumar@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10010", email: "diya.thomas@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10011", email: "sanjay.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10012", email: "lakshmi.menon@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10013", email: "faisal.rahman@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10014", email: "sneha.pillai@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10015", email: "akhil.joseph@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10016", email: "divya.krishnan@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10017", email: "manu.varghese@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10018", email: "pooja.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10019", email: "nithin.kumar@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10020", email: "amrutha.menon@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10021", email: "jithin.thomas@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10022", email: "resmi.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10023", email: "abin.joseph@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10024", email: "gopika.krishnan@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10025", email: "sreejith.menon@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10026", email: "malavika.nair@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10027", email: "akhila.varma@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10028", email: "nikhil.pillai@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10029", email: "keerthi.thomas@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" },
    { licenseNumber: "KL-MCI-2024-10030", email: "roshan.rahman@example.com", issuingAuthority: "Kerala State Medical Council", status: "ACTIVE" }
];

const doctors = [
    { email: "arjun.nair@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "ananya.menon@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "rahul.krishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "meera.pillai@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "vishnu.kumar@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "lakshmi.ravi@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "sanjay.varma@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "divya.krish@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "nithin.joseph@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "fathima.ali@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "abin.thomas@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "sreelakshmi.nair@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "mohammed.shan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "neha.menon@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "akhil.suresh@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "parvathy.krishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "rohit.pillai@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "sneha.ravi@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "amal.varghese@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "keerthi.krish@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "roshan.nair@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "arya.menon@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "gokul.krishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "athira.pillai@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "vivek.kumar@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "sandra.joseph@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "naveen.thomas@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "amalya.ali@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "sachin.varma@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true },
    { email: "roshan.rahman@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "DOCTOR", status: "ACTIVE", emailVerified: true }
];

const doctorProfiles = [
    { email: "arjun.nair@example.com", firstName: "Arjun", lastName: "Nair", phone: "9876500001", dateOfBirth: "1985-04-12", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673001" },
    { email: "ananya.menon@example.com", firstName: "Ananya", lastName: "Menon", phone: "9876500002", dateOfBirth: "1988-07-23", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682001" },
    { email: "rahul.krishnan@example.com", firstName: "Rahul", lastName: "Krishnan", phone: "9876500003", dateOfBirth: "1982-02-15", gender: "MALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670001" },
    { email: "meera.pillai@example.com", firstName: "Meera", lastName: "Pillai", phone: "9876500004", dateOfBirth: "1987-11-08", gender: "FEMALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680001" },
    { email: "vishnu.kumar@example.com", firstName: "Vishnu", lastName: "Kumar", phone: "9876500005", dateOfBirth: "1984-06-19", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673004" },
    { email: "lakshmi.ravi@example.com", firstName: "Lakshmi", lastName: "Ravi", phone: "9876500006", dateOfBirth: "1990-03-25", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682020" },
    { email: "sanjay.varma@example.com", firstName: "Sanjay", lastName: "Varma", phone: "9876500007", dateOfBirth: "1981-09-14", gender: "MALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678001" },
    { email: "divya.krish@example.com", firstName: "Divya", lastName: "Krish", phone: "9876500008", dateOfBirth: "1989-01-30", gender: "FEMALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691001" },
    { email: "nithin.joseph@example.com", firstName: "Nithin", lastName: "Joseph", phone: "9876500009", dateOfBirth: "1983-12-05", gender: "MALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686001" },
    { email: "fathima.ali@example.com", firstName: "Fathima", lastName: "Ali", phone: "9876500010", dateOfBirth: "1991-05-17", gender: "FEMALE", city: "Malappuram", state: "Kerala", country: "India", postalCode: "676505" },
    { email: "abin.thomas@example.com", firstName: "Abin", lastName: "Thomas", phone: "9876500011", dateOfBirth: "1986-08-21", gender: "MALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682011" },
    { email: "sreelakshmi.nair@example.com", firstName: "Sreelakshmi", lastName: "Nair", phone: "9876500012", dateOfBirth: "1988-10-11", gender: "FEMALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673005" },
    { email: "mohammed.shan@example.com", firstName: "Mohammed", lastName: "Shan", phone: "9876500013", dateOfBirth: "1980-04-28", gender: "MALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670002" },
    { email: "neha.menon@example.com", firstName: "Neha", lastName: "Menon", phone: "9876500014", dateOfBirth: "1992-02-09", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682016" },
    { email: "akhil.suresh@example.com", firstName: "Akhil", lastName: "Suresh", phone: "9876500015", dateOfBirth: "1984-07-16", gender: "MALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680020" },
    { email: "parvathy.krishnan@example.com", firstName: "Parvathy", lastName: "Krishnan", phone: "9876500016", dateOfBirth: "1987-12-22", gender: "FEMALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691004" },
    { email: "rohit.pillai@example.com", firstName: "Rohit", lastName: "Pillai", phone: "9876500017", dateOfBirth: "1982-05-03", gender: "MALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686002" },
    { email: "sneha.ravi@example.com", firstName: "Sneha", lastName: "Ravi", phone: "9876500018", dateOfBirth: "1990-09-27", gender: "FEMALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678002" },
    { email: "amal.varghese@example.com", firstName: "Amal", lastName: "Varghese", phone: "9876500019", dateOfBirth: "1985-03-13", gender: "MALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682018" },
    { email: "keerthi.krish@example.com", firstName: "Keerthi", lastName: "Krish", phone: "9876500020", dateOfBirth: "1989-06-07", gender: "FEMALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673016" },
    { email: "roshan.nair@example.com", firstName: "Roshan", lastName: "Nair", phone: "9876500021", dateOfBirth: "1983-01-18", gender: "MALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670003" },
    { email: "arya.menon@example.com", firstName: "Arya", lastName: "Menon", phone: "9876500022", dateOfBirth: "1991-11-24", gender: "FEMALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680005" },
    { email: "gokul.krishnan@example.com", firstName: "Gokul", lastName: "Krishnan", phone: "9876500023", dateOfBirth: "1986-02-26", gender: "MALE", city: "Malappuram", state: "Kerala", country: "India", postalCode: "676519" },
    { email: "athira.pillai@example.com", firstName: "Athira", lastName: "Pillai", phone: "9876500024", dateOfBirth: "1988-08-15", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682024" },
    { email: "vivek.kumar@example.com", firstName: "Vivek", lastName: "Kumar", phone: "9876500025", dateOfBirth: "1981-10-02", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673018" },
    { email: "sandra.joseph@example.com", firstName: "Sandra", lastName: "Joseph", phone: "9876500026", dateOfBirth: "1992-04-06", gender: "FEMALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686003" },
    { email: "naveen.thomas@example.com", firstName: "Naveen", lastName: "Thomas", phone: "9876500027", dateOfBirth: "1984-12-19", gender: "MALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678003" },
    { email: "amalya.ali@example.com", firstName: "Amalya", lastName: "Ali", phone: "9876500028", dateOfBirth: "1990-07-29", gender: "FEMALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691005" },
    { email: "sachin.varma@example.com", firstName: "Sachin", lastName: "Varma", phone: "9876500029", dateOfBirth: "1982-03-08", gender: "MALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682030" },
    { email: "roshan.rahman@example.com", firstName: "Roshan", lastName: "Rahman", phone: "9876500030", dateOfBirth: "1987-05-20", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673020" }
];

const patients = [
    { email: "anil.madhavan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sreya.krishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "manoj.nair@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "devika.menon@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sujith.kumar@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "resha.paul@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "biju.varghese@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "nandana.ramesh@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "joseph.mathew@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "aiswarya.krish@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sudheesh.babu@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "lekshmi.suresh@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "abinaya.das@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sajeev.mohan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "gopika.suresh@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "harikrishnan.p@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "bindu.george@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sreehari.nair@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "merin.jacob@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sabin.thomas@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "lekha.murali@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "roshan.mathew@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "deepa.raghavan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "akhilesh.mohan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "remya.balakrishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "sabin.jose@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "midhun.ravi@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "soumya.pillai@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "nithya.krishnan@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true },
    { email: "pradeep.menon@example.com", passwordHash: "$2b$12$KHQkxVjS0x61F1IC64siu.Q4yWB1G1syE5qCFQrg0fXu3gjG33mI6", role: "PATIENT", status: "ACTIVE", emailVerified: true }
];

const patientProfiles = [
    { email: "anil.madhavan@example.com", firstName: "Anil", lastName: "Madhavan", phone: "9876510001", dateOfBirth: "1988-04-12", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673001" },
    { email: "sreya.krishnan@example.com", firstName: "Sreya", lastName: "Krishnan", phone: "9876510002", dateOfBirth: "1996-07-23", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682001" },
    { email: "manoj.nair@example.com", firstName: "Manoj", lastName: "Nair", phone: "9876510003", dateOfBirth: "1985-02-15", gender: "MALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670001" },
    { email: "devika.menon@example.com", firstName: "Devika", lastName: "Menon", phone: "9876510004", dateOfBirth: "1997-11-08", gender: "FEMALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680001" },
    { email: "sujith.kumar@example.com", firstName: "Sujith", lastName: "Kumar", phone: "9876510005", dateOfBirth: "1990-06-19", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673004" },
    { email: "resha.paul@example.com", firstName: "Resha", lastName: "Paul", phone: "9876510006", dateOfBirth: "1995-03-25", gender: "FEMALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682020" },
    { email: "biju.varghese@example.com", firstName: "Biju", lastName: "Varghese", phone: "9876510007", dateOfBirth: "1982-09-14", gender: "MALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678001" },
    { email: "nandana.ramesh@example.com", firstName: "Nandana", lastName: "Ramesh", phone: "9876510008", dateOfBirth: "1999-01-30", gender: "FEMALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691001" },
    { email: "joseph.mathew@example.com", firstName: "Joseph", lastName: "Mathew", phone: "9876510009", dateOfBirth: "1987-12-05", gender: "MALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686001" },
    { email: "aiswarya.krish@example.com", firstName: "Aiswarya", lastName: "Krish", phone: "9876510010", dateOfBirth: "1997-05-17", gender: "FEMALE", city: "Malappuram", state: "Kerala", country: "India", postalCode: "676505" },
    { email: "sudheesh.babu@example.com", firstName: "Sudheesh", lastName: "Babu", phone: "9876510011", dateOfBirth: "1989-08-21", gender: "MALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682011" },
    { email: "lekshmi.suresh@example.com", firstName: "Lekshmi", lastName: "Suresh", phone: "9876510012", dateOfBirth: "1998-10-11", gender: "FEMALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673005" },
    { email: "abinaya.das@example.com", firstName: "Abinaya", lastName: "Das", phone: "9876510013", dateOfBirth: "1990-04-28", gender: "FEMALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670002" },
    { email: "sajeev.mohan@example.com", firstName: "Sajeev", lastName: "Mohan", phone: "9876510014", dateOfBirth: "1986-02-09", gender: "MALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682016" },
    { email: "gopika.suresh@example.com", firstName: "Gopika", lastName: "Suresh", phone: "9876510015", dateOfBirth: "1994-07-16", gender: "FEMALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680020" },
    { email: "harikrishnan.p@example.com", firstName: "Harikrishnan", lastName: "P", phone: "9876510016", dateOfBirth: "1992-12-22", gender: "MALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691004" },
    { email: "bindu.george@example.com", firstName: "Bindu", lastName: "George", phone: "9876510017", dateOfBirth: "1984-05-03", gender: "FEMALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686002" },
    { email: "sreehari.nair@example.com", firstName: "Sreehari", lastName: "Nair", phone: "9876510018", dateOfBirth: "1999-09-27", gender: "MALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678002" },
    { email: "merin.jacob@example.com", firstName: "Merin", lastName: "Jacob", phone: "9876510019", dateOfBirth: "1995-03-13", gender: "FEMALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682018" },
    { email: "sabin.thomas@example.com", firstName: "Sabin", lastName: "Thomas", phone: "9876510020", dateOfBirth: "1993-06-07", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673016" },
    { email: "lekha.murali@example.com", firstName: "Lekha", lastName: "Murali", phone: "9876510021", dateOfBirth: "1991-01-18", gender: "FEMALE", city: "Kannur", state: "Kerala", country: "India", postalCode: "670003" },
    { email: "roshan.mathew@example.com", firstName: "Roshan", lastName: "Mathew", phone: "9876510022", dateOfBirth: "1988-11-24", gender: "MALE", city: "Thrissur", state: "Kerala", country: "India", postalCode: "680005" },
    { email: "deepa.raghavan@example.com", firstName: "Deepa", lastName: "Raghavan", phone: "9876510023", dateOfBirth: "1996-02-26", gender: "FEMALE", city: "Malappuram", state: "Kerala", country: "India", postalCode: "676519" },
    { email: "akhilesh.mohan@example.com", firstName: "Akhilesh", lastName: "Mohan", phone: "9876510024", dateOfBirth: "1990-08-15", gender: "MALE", city: "Kochi", state: "Kerala", country: "India", postalCode: "682024" },
    { email: "remya.balakrishnan@example.com", firstName: "Remya", lastName: "Balakrishnan", phone: "9876510025", dateOfBirth: "1991-10-02", gender: "FEMALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673018" },
    { email: "sabin.jose@example.com", firstName: "Sabin", lastName: "Jose", phone: "9876510026", dateOfBirth: "1994-04-06", gender: "MALE", city: "Kottayam", state: "Kerala", country: "India", postalCode: "686003" },
    { email: "midhun.ravi@example.com", firstName: "Midhun", lastName: "Ravi", phone: "9876510027", dateOfBirth: "1989-12-19", gender: "MALE", city: "Palakkad", state: "Kerala", country: "India", postalCode: "678003" },
    { email: "soumya.pillai@example.com", firstName: "Soumya", lastName: "Pillai", phone: "9876510028", dateOfBirth: "1999-07-29", gender: "FEMALE", city: "Kollam", state: "Kerala", country: "India", postalCode: "691005" },
    { email: "nithya.krishnan@example.com", firstName: "Nithya", lastName: "Krishnan", phone: "9876510029", dateOfBirth: "1992-03-08", gender: "FEMALE", city: "Ernakulam", state: "Kerala", country: "India", postalCode: "682030" },
    { email: "pradeep.menon@example.com", firstName: "Pradeep", lastName: "Menon", phone: "9876510030", dateOfBirth: "1987-05-20", gender: "MALE", city: "Kozhikode", state: "Kerala", country: "India", postalCode: "673020" }
];

async function generateDoctorLicence() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL_SCRIPT,
    });

    const query = `
        INSERT INTO doctor_licenses (
            license_number,
            email,
            issuing_authority,
            status,
            verified_at
        )
        VALUES ${doctorLicenses.map((_, i) =>
        `($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, NOW())`
    ).join(", ")}
     ON CONFLICT (issuing_authority, license_number) DO NOTHING
    `;

    const values = doctorLicenses.flatMap(license => [
        license.licenseNumber,
        license.email,
        license.issuingAuthority,
        license.status
    ]);

    try {
        await client.connect();
        console.log("database connection successfull");
        await client.query(query, values);
        console.log("license data added successfully");
    } catch (error) {
        console.log("adding license data failed", error)
    }
}

async function createUserandProile(role: UserRole) {
    const client = new Client({
        connectionString: process.env.DATABASE_URL_SCRIPT,
    });

    let userData;
    let userProfileData;
    switch (role) {
        case "DOCTOR":
            userData = doctors;
            userProfileData = doctorProfiles;
            break;

        case "PATIENT":
            userData = patients;
            userProfileData = patientProfiles;
            break;

        default:
            throw new Error("Invalid user role");
    }

    const createUserQuery = `
        INSERT INTO users (
            email,
            password_hash,
            role,
            status,
            email_verified
        )
        VALUES ${userData.map((_, i) =>
        `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3}, 'ACTIVE', TRUE)`
    ).join(", ")}
        ON CONFLICT (email) DO NOTHING
    `;

    const userValues = userData.flatMap(user => [
        user.email,
        user.passwordHash,
        user.role
    ]);

    const createTempTableQuery = `
        CREATE TEMP TABLE profile_seed_data (
            email VARCHAR(255),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100),
            phone VARCHAR(20) NOT NULL,
            date_of_birth DATE NOT NULL,
            gender VARCHAR(20) NOT NULL,
            city VARCHAR(100),
            state VARCHAR(100),
            country VARCHAR(100),
            postal_code VARCHAR(20)
        ) ON COMMIT DROP;
    `;

    const insertSeedDataQuery = `
        INSERT INTO profile_seed_data (
            email, first_name, last_name, phone, date_of_birth,
            gender, city, state, country, postal_code
        )
        VALUES ${userProfileData.map((_, i) =>
        `($${i * 10 + 1}, $${i * 10 + 2}, $${i * 10 + 3}, $${i * 10 + 4}, $${i * 10 + 5},
            $${i * 10 + 6}, $${i * 10 + 7}, $${i * 10 + 8}, $${i * 10 + 9}, $${i * 10 + 10})`
    ).join(", ")};
    `;

    const createUserProile = `
           INSERT INTO user_profiles (
                user_id, first_name, last_name, phone, date_of_birth,
                gender, city, state, country, postal_code
            )
            SELECT
                u.id,
                p.first_name,
                p.last_name,
                p.phone,
                p.date_of_birth,
                p.gender,
                p.city,
                p.state,
                p.country,
                p.postal_code
            FROM users AS u
            JOIN profile_seed_data AS p
                ON u.email = p.email;
    `

    const userProfileValues = userProfileData.flatMap(profile => [
        profile.email,
        profile.firstName,
        profile.lastName,
        profile.phone,
        profile.dateOfBirth,
        profile.gender,
        profile.city,
        profile.state,
        profile.country,
        profile.postalCode
    ]);

    const user_and_profile_matchQuery = `
        SELECT
        (SELECT COUNT(*) FROM users WHERE role IN ('DOCTOR', 'PATIENT')) AS user_count,
        (SELECT COUNT(*) FROM user_profiles) AS profile_count,
        (
            SELECT COUNT(*)
            FROM users u
            JOIN user_profiles p ON u.id = p.user_id
            WHERE u.role IN ('DOCTOR', 'PATIENT')
        ) AS matched_count;
    `

    try {
        await client.connect();
        console.log("Database connection successful");

        await client.query("BEGIN");
        console.log("Transaction started");

        await client.query(createUserQuery, userValues);
        console.log(`${role} data added successfully`);

        await client.query(createTempTableQuery);
        console.log(`${role} temp table created`);

        await client.query(insertSeedDataQuery, userProfileValues);
        console.log(`${role} temp table data added successfully`);

        await client.query(createUserProile);
        console.log(`${role} profile data added successfully`);

        await client.query("COMMIT");
        console.log("Transaction completed");

        const verifyUserProfileSeedData = await client.query(user_and_profile_matchQuery);
        console.log("User and profile verification:", verifyUserProfileSeedData.rows[0]);

    } catch (error) {
        console.log(`Adding ${role} data failed`, error);

        try {
            await client.query("ROLLBACK");
            console.log("Rollback completed");
        } catch (rollbackError) {
            console.log("Rollback failed", rollbackError);
        }
    } finally {
        await client.end();
    }
}

// generateDoctorLicence();
// await createUserandProile("DOCTOR");
// await createUserandProile("PATIENT");