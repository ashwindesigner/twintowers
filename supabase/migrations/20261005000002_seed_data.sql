-- Seed data generated from project/data.js by supabase/gen-seed.mjs

insert into public.core_members (id, name, role, team, tower, flat, phone, email, responsibilities, avatar, sort) values
  ('cm1', 'Suresh Narayanan', 'President', 'Administration', 'Tower A', 'A-101', '9845012345', 'suresh.n@twintowers.in', array['RWA governance','Legal matters','Finance oversight']::text[], 'SN', 0),
  ('cm2', 'Priya Venkatesh', 'Secretary', 'Administration', 'Tower B', 'B-201', '9845023456', 'priya.v@twintowers.in', array['Meeting minutes','Communication','Document management']::text[], 'PV', 1),
  ('cm3', 'Ramesh Iyer', 'Treasurer', 'Finance', 'Tower A', 'A-502', '9845034567', 'ramesh.i@twintowers.in', array['Budget management','Maintenance fees','Vendor payments']::text[], 'RI', 2),
  ('cm4', 'Kavitha Subramaniam', 'Tower A Maintenance Head', 'Tower A Maintenance', 'Tower A', 'A-801', '9845045678', 'kavitha.s@twintowers.in', array['Tower A lifts','Lights','CCTV','Staircase']::text[], 'KS', 3),
  ('cm5', 'Mohan Krishnamurthy', 'Tower B Maintenance Head', 'Tower B Maintenance', 'Tower B', 'B-1102', '9845056789', 'mohan.k@twintowers.in', array['Tower B lifts','Lights','CCTV','Staircase']::text[], 'MK', 4),
  ('cm6', 'Anitha Reddy', 'Cultural Committee Head', 'Cultural', 'Tower B', 'B-304', '9845067890', 'anitha.r@twintowers.in', array['Event planning','Festival coordination','Gallery updates']::text[], 'AR', 5),
  ('cm7', 'Srinivas Rao', 'Clubhouse & Common Areas', 'Common Areas', 'Tower A', 'A-604', '9845078901', 'srinivas.r@twintowers.in', array['Clubhouse facilities','Pool maintenance','Gym','Gardens']::text[], 'SR', 6),
  ('cm8', 'Deepa Murthy', 'Security Coordinator', 'Security', 'Tower B', 'B-702', '9845089012', 'deepa.m@twintowers.in', array['Security personnel','CCTV monitoring','Visitor management','Gate access']::text[], 'DM', 7);
insert into public.maintenance_items (id, category, subcategory, name, status, last_inspected, next_check, assigned_to, warranty_expiry, notes, sort) values
  ('m1', 'Tower A', 'Lift', 'Tower A Lift', 'Fair', '2026-04-18', '2026-05-01', 'Kavitha Subramaniam', '2026-07-15', 'Minor vibration on floor 7. Service due soon.', 0),
  ('m2', 'Tower A', 'Lights', 'Tower A Corridor Lights', 'Good', '2026-04-22', '2026-05-22', 'Kavitha Subramaniam', null, 'All lights functional. LED replacement done.', 1),
  ('m3', 'Tower A', 'CCTV', 'Tower A Security Cameras', 'Good', '2026-04-20', '2026-05-20', 'Deepa Murthy', '2027-01-10', 'All 12 cameras operational.', 2),
  ('m4', 'Tower B', 'Lift', 'Tower B Lift', 'Good', '2026-04-25', '2026-05-25', 'Mohan Krishnamurthy', '2026-09-30', 'Operating normally post recent service.', 3),
  ('m5', 'Tower B', 'Staircase', 'Tower B Staircase', 'Fair', '2026-04-19', '2026-04-30', 'Mohan Krishnamurthy', null, 'Handrail loose on 9th floor. Repair scheduled.', 4),
  ('m6', 'Common Areas', 'Water Supply', 'Water Supply System', 'Good', '2026-04-26', '2026-05-10', 'Srinivas Rao', null, 'Overhead tank cleaned. Motor serviced.', 5),
  ('m7', 'Common Areas', 'Play Area', 'Children''s Play Area', 'Fair', '2026-04-21', '2026-05-05', 'Srinivas Rao', null, 'Swing chain needs replacement. Slide in good condition.', 6),
  ('m8', 'Clubhouse', 'Swimming Pool', 'Swimming Pool', 'Good', '2026-04-24', '2026-04-28', 'Srinivas Rao', null, 'Chlorine levels normal. Pump operational. Last cleaned 3 days ago.', 7),
  ('m9', 'Clubhouse', 'Gym Equipment', 'Gym Equipment', 'Poor', '2026-04-23', '2026-04-28', 'Srinivas Rao', '2026-06-01', 'Treadmill #2 out of service. Warranty claim raised with vendor.', 8),
  ('m10', 'Parking', 'Basement 2', 'Basement 2 Lights', 'Poor', '2026-04-22', '2026-04-29', 'Kavitha Subramaniam', null, '6 tube lights not working in B2-North zone. Electrician scheduled.', 9);
insert into public.maintenance_history (item_id, date, status, note, inspector) values
  ('m1', '2026-04-18', 'Fair', 'Vibration noted at 7th floor', 'Kavitha Subramaniam'),
  ('m1', '2026-03-20', 'Good', 'Annual service completed', 'Kavitha Subramaniam'),
  ('m2', '2026-04-22', 'Good', '3 LED bulbs replaced in B-block corridor', 'Kavitha Subramaniam'),
  ('m3', '2026-04-20', 'Good', 'All cameras checked, DVR cleaned', 'Deepa Murthy'),
  ('m4', '2026-04-25', 'Good', 'Quarterly service completed by vendor', 'Mohan Krishnamurthy'),
  ('m5', '2026-04-19', 'Fair', 'Handrail loose on 9th floor — repair order placed', 'Mohan Krishnamurthy'),
  ('m6', '2026-04-26', 'Good', 'Tank cleaning completed', 'Srinivas Rao'),
  ('m7', '2026-04-21', 'Fair', 'Swing chain worn out, replacement ordered', 'Srinivas Rao'),
  ('m8', '2026-04-24', 'Good', 'Chlorine check: 2.1ppm ✓, pH: 7.4 ✓, Pump OK', 'Srinivas Rao'),
  ('m8', '2026-04-21', 'Good', 'Full pool cleaning completed', 'Srinivas Rao'),
  ('m9', '2026-04-23', 'Poor', 'Treadmill #2 belt snapped. Vendor notified for warranty repair', 'Srinivas Rao'),
  ('m10', '2026-04-22', 'Poor', '6 tube lights non-functional in B2-North. Electrician booked for Apr 29', 'Kavitha Subramaniam');
insert into public.issues (id, category, subcategory, priority, status, raised_by, raised_by_name, flat, assigned_to, area, description, sla, created_at, updated_at) values
  ('TT-001', 'Maintenance', 'Lift', 'High', 'In Progress', null, 'Arun Kumar', 'A-507', 'Kavitha Subramaniam', 'Tower A', 'Lift stuck between 5th and 6th floor for 20 mins. Passengers had to be evacuated.', '2026-04-26', '2026-04-25T09:15:00+05:30', '2026-04-25T11:30:00+05:30'),
  ('TT-002', 'Water', 'Water Leakage', 'High', 'Open', null, 'Meena Patel', 'A-302', 'Srinivas Rao', 'Parking', 'Water leakage near parking spot B1-23 in Basement 1. Floor wet and slippery. Safety hazard.', '2026-04-27', '2026-04-26T07:45:00+05:30', '2026-04-26T07:45:00+05:30'),
  ('TT-003', 'Maintenance', 'Gym Equipment', 'Medium', 'In Progress', null, 'Ravi Shankar', 'A-302', 'Srinivas Rao', 'Clubhouse', 'Treadmill #2 in gym not working. Belt seems to have snapped. Please repair urgently.', '2026-04-28', '2026-04-23T18:20:00+05:30', '2026-04-24T10:00:00+05:30'),
  ('TT-004', 'Noise', 'Residential Noise', 'Medium', 'Open', null, 'Sunita Sharma', 'B-503', 'Deepa Murthy', 'Tower B', 'Loud music and noise from flat B-504 after 11 PM. Has been happening for 3 days in a row.', '2026-04-25', '2026-04-24T23:45:00+05:30', '2026-04-24T23:45:00+05:30'),
  ('TT-005', 'Security', 'CCTV', 'High', 'Resolved', null, 'Deepa Murthy', 'B-702', 'Deepa Murthy', 'Common Area', 'Camera C-07 near east gate not recording since Apr 18. Blind spot in security coverage.', '2026-04-22', '2026-04-20T14:00:00+05:30', '2026-04-22T16:00:00+05:30'),
  ('TT-006', 'Cleanliness', 'Garbage', 'Low', 'Resolved', null, 'Rekha Nair', 'A-204', 'Srinivas Rao', 'Common Area', 'Garbage overflow near dustbin at Tower A entrance. Bins not emptied since Saturday.', '2026-04-22', '2026-04-21T08:30:00+05:30', '2026-04-21T15:00:00+05:30'),
  ('TT-007', 'Parking', 'Parking Dispute', 'Medium', 'On Hold', null, 'Vijay Kumar', 'B-905', 'Deepa Murthy', 'Parking', 'Unknown vehicle parked in my assigned spot B2-47 repeatedly. Third time this week.', '2026-04-25', '2026-04-23T19:00:00+05:30', '2026-04-24T09:00:00+05:30'),
  ('TT-008', 'Water', 'Water Shortage', 'High', 'Resolved', null, 'Lakshmi Reddy', 'A-1001', 'Srinivas Rao', 'Tower A', 'No water supply to floors 9-12 in Tower A since morning. Please check overhead tank pump.', '2026-04-19', '2026-04-19T07:00:00+05:30', '2026-04-19T14:00:00+05:30'),
  ('TT-009', 'Maintenance', 'Play Equipment', 'Low', 'In Progress', null, 'Priti Joshi', 'B-404', 'Srinivas Rao', 'Common Area', 'Swing chain broken in children''s play area. Risk of injury to kids.', '2026-04-27', '2026-04-22T17:30:00+05:30', '2026-04-23T09:00:00+05:30'),
  ('TT-010', 'Cleanliness', 'Common Area', 'Low', 'Open', null, 'Manoj Singh', 'B-607', 'Srinivas Rao', 'Common Area', 'Corridor on 6th floor of Tower B has not been cleaned for 3 days. Bad smell.', '2026-04-28', '2026-04-26T10:00:00+05:30', '2026-04-26T10:00:00+05:30');
insert into public.issue_comments (issue_id, author_id, author_name, body, created_at) values
  ('TT-001', null, 'Kavitha Subramaniam', 'Elevator technician contacted. Will be on-site by 2 PM.', '2026-04-25T11:30:00+05:30'),
  ('TT-003', null, 'Srinivas Rao', 'Warranty claim raised with vendor. Expected resolution in 3-5 days.', '2026-04-24T10:00:00+05:30'),
  ('TT-005', null, 'Deepa Murthy', 'Camera replaced and tested. Recording resumed.', '2026-04-22T16:00:00+05:30'),
  ('TT-007', null, 'Deepa Murthy', 'Vehicle identified. Owner contacted. Awaiting response.', '2026-04-24T09:00:00+05:30'),
  ('TT-008', null, 'Srinivas Rao', 'Motor fault fixed. Water supply restored.', '2026-04-19T14:00:00+05:30'),
  ('TT-009', null, 'Srinivas Rao', 'New chain ordered. Installation scheduled for Apr 29.', '2026-04-23T09:00:00+05:30');
insert into public.events (id, name, date, time_label, location, organizer, description, registered_base, capacity, status, category) values
  ('e1', 'Ganesh Chaturthi Celebration', '2026-08-27', '6:00 PM onwards', 'Club House Lawn', 'Anitha Reddy', 'Annual Ganesh Chaturthi celebration with pooja, prasad, and cultural programs. All residents invited.', 87, 200, 'upcoming', 'Festival'),
  ('e2', 'Independence Day Flag Hoisting', '2026-08-15', '8:00 AM', 'Main Entrance', 'Suresh Narayanan', 'Flag hoisting ceremony followed by breakfast for all residents.', 120, 300, 'upcoming', 'National'),
  ('e3', 'Monthly Community Meetup', '2026-05-04', '11:00 AM', 'Club House Banquet Hall', 'Priya Venkatesh', 'Monthly RWA open house meeting. Discuss pending issues, upcoming events and maintenance updates.', 45, 100, 'upcoming', 'Community'),
  ('e4', 'Summer Sports Day', '2026-05-18', '7:00 AM – 12:00 PM', 'Badminton Courts & Lawn', 'Anitha Reddy', 'Summer sports festival with badminton, chess, and fun games for kids and adults.', 62, 150, 'upcoming', 'Sports'),
  ('e5', 'Diwali Night', '2026-10-20', '7:00 PM onwards', 'Club House Lawn', 'Anitha Reddy', 'Grand Diwali celebration with rangoli, fireworks, dinner, and cultural performances.', 0, 250, 'planning', 'Festival');
insert into public.proposals (id, name, proposed_by, flat, description, budget, proposed_date, status, approved_by, votes_yes, votes_no) values
  ('p1', 'Onam Celebration 2026', 'Rekha Nair', 'A-204', 'Organize an Onam celebration with traditional Kerala feast (Onam Sadya), pookalam (flower rangoli) competition, and cultural performances.', 45000, '2026-09-06', 'approved', 'Anitha Reddy', 34, 2),
  ('p2', 'Children''s Annual Day', 'Priti Joshi', 'B-404', 'A dedicated children''s annual day event with drawing competition, fancy dress, and mini-sports for kids aged 3-14.', 25000, '2026-06-01', 'under_review', null, 28, 5),
  ('p3', 'Movie Night Under Stars', 'Vijay Kumar', 'B-905', 'Monthly outdoor movie screening on the club house lawn. Family-friendly movies, popcorn and beverages.', 8000, '2026-05-15', 'pending', null, 41, 3);
insert into public.gallery_albums (name, photo_count, date_label, emoji, hue, sort) values
  ('Ugadi 2026', 24, 'Apr 2026', '🌸', 45, 0),
  ('New Year 2026', 38, 'Jan 2026', '🎆', 200, 1),
  ('Diwali 2025', 52, 'Oct 2025', '🪔', 270, 2),
  ('Ganesh Chaturthi 2025', 41, 'Sep 2025', '🐘', 120, 3),
  ('Sports Day 2025', 29, 'May 2025', '🏅', 30, 4),
  ('Onam 2025', 33, 'Sep 2025', '🌺', 160, 5);
insert into public.facilities (id, name, icon, slots, max_duration, buffer, charges, rules, sort) values
  ('f1', 'Badminton Court 1', '🏸', 30, 60, 15, 'Free', array['Max 60 min per booking','Max 2 active bookings per flat','Bring your own racket','Court shoes mandatory']::text[], 0),
  ('f2', 'Badminton Court 2', '🏸', 30, 60, 15, 'Free', array['Max 60 min per booking','Max 2 active bookings per flat','Bring your own racket','Court shoes mandatory']::text[], 1),
  ('f3', 'Lawn Area', '🌿', 8, 180, 30, '₹500 for events', array['Max 3 hours per booking','Advance notice of 48 hrs for events','No loud music after 10 PM','Clean up after use']::text[], 2),
  ('f4', 'Banquet Hall', '🏛️', 4, 360, 60, '₹2000/day', array['Advance booking 7 days prior','Max 150 guests','Catering vendor list provided','Deposit of ₹5000 required']::text[], 3),
  ('f5', 'Club House Room', '🪑', 12, 120, 15, 'Free', array['Max 2 hours per booking','For meetings or small gatherings only','Max 20 people']::text[], 4);
insert into public.bookings (id, facility_id, date, start_time, end_time, user_id, booked_by, flat, status, purpose) values
  ('TT-BK-B1', 'f1', '2026-04-27', '07:00', '08:00', null, 'Ravi Shankar', 'A-302', 'confirmed', null),
  ('TT-BK-B2', 'f2', '2026-04-27', '19:00', '20:00', null, 'Arun Kumar', 'A-507', 'confirmed', null),
  ('TT-BK-B3', 'f3', '2026-04-27', '10:00', '13:00', null, 'Sunita Sharma', 'B-503', 'confirmed', 'Birthday Party'),
  ('TT-BK-B4', 'f4', '2026-10-20', '17:00', '23:00', null, 'Anitha Reddy', 'B-304', 'blocked', 'Diwali Night (Community Event)'),
  ('TT-BK-B5', 'f1', '2026-04-28', '07:00', '08:00', null, 'Meena Patel', 'B-601', 'confirmed', null),
  ('TT-BK-B6', 'f1', '2026-04-27', '18:00', '19:00', null, 'Mohan Krishnamurthy', 'B-1102', 'confirmed', null);
insert into public.community_policies (id, category, icon, rules, sort) values
  ('pol1', 'Swimming Pool', '🏊', array['Pool timings: 6:00 AM – 9:00 AM and 4:00 PM – 8:00 PM daily.','Children below 12 years must be accompanied by an adult at all times.','Proper swimwear mandatory. No street clothes or jeans in the pool.','No food or drinks inside the pool area.','Shower before entering the pool.','No diving, running, or rough play in the pool area.','Persons with infectious diseases or open wounds must not use the pool.','Pool will be closed on maintenance days (notified in advance).']::text[], 0),
  ('pol2', 'Clubhouse', '🏛️', array['Clubhouse timings: 6:00 AM – 10:00 PM daily.','No loud music or noise after 9:00 PM.','Prior booking required for banquet hall, courts, and lawn.','Residents are responsible for guests'' behavior.','Maximum 2 guests per flat allowed in gym without special permission.','No smoking or alcohol consumption in common clubhouse areas.','Pets are not allowed inside the clubhouse.','Food and drinks allowed only in designated dining areas.']::text[], 1),
  ('pol3', 'Parking', '🅿️', array['Each flat is assigned a designated parking slot. Use only your allotted space.','Visitor parking is available in designated bays near the main gate only.','Do not block fire exit lanes or emergency vehicle pathways at any time.','No vehicle repairs or washing in basement parking.','Speed limit inside parking: 10 km/h.','Two-wheelers must use designated two-wheeler parking zones.','Vehicles left unattended for more than 30 days without notice may be towed.','Flats with multiple vehicles must register all vehicles with security.']::text[], 2),
  ('pol4', 'Common Areas', '🌳', array['No littering in common areas. Use designated dustbins.','Children''s play area timings: 7:00 AM – 7:30 PM.','Do not damage plants, garden, or community property.','No commercial activity or solicitation in common areas.','Domestic staff must carry valid ID and be registered with security.','Noise levels must be kept low in corridors, especially after 10 PM.','Common area furniture must not be taken inside flats.','Residents must not hang laundry from balconies facing common areas.']::text[], 3),
  ('pol5', 'Noise & Nuisance', '🔇', array['Silence hours: 10:00 PM – 6:00 AM. No loud music, drilling, or construction noise.','Parties or gatherings with amplified music require prior written permission from RWA.','Drilling/renovation work allowed: 9:00 AM – 6:00 PM on weekdays only.','Residents are liable for disturbances caused by their guests.','Disputes must be escalated to the Core Committee, not resolved physically.','Repeated violations may result in monetary penalties as per by-laws.']::text[], 4);
insert into public.polls (id, title, description, start_date, end_date, eligible_voters, options, base_votes, total_eligible, status) values
  ('pl1', 'Election of Tower A Maintenance Task Member', 'Elect the resident representative who will oversee maintenance activities in Tower A for the term 2026-27.', '2026-04-20', '2026-04-30', 'Tower A Residents', array['Kavitha Subramaniam','Ramesh Babu','Anand Krishnan']::text[], array[52,31,17]::int[], 120, 'active'),
  ('pl2', 'CCTV Expansion — Basement 2', 'Should we install 4 additional CCTV cameras in Basement 2 at an estimated cost of ₹24,000 (to be covered by maintenance fund)?', '2026-04-22', '2026-04-29', 'All Residents', array['Yes, proceed immediately','Yes, but defer to next quarter','No, not required']::text[], array[89,23,12]::int[], 240, 'active'),
  ('pl3', 'Diwali 2026 Celebration Budget', 'Choose the preferred budget range for the Diwali 2026 grand celebration at Twin Towers.', '2026-04-15', '2026-04-25', 'All Residents', array['₹50,000 – ₹75,000','₹75,000 – ₹1,00,000','₹1,00,000 – ₹1,50,000']::text[], array[45,98,62]::int[], 240, 'closed'),
  ('pl4', 'Pet Policy — Lifts & Common Areas', 'Should pets be allowed in residential lifts and common areas, subject to the owner maintaining hygiene and leash rules?', '2026-05-01', '2026-05-10', 'All Residents', array['Yes, allowed with conditions','Yes, allowed without restrictions','No, pets must use service elevator only']::text[], array[0,0,0]::int[], 240, 'upcoming');
insert into public.notifications (id, user_id, type, title, message, created_at) values
  ('n2', null, 'maintenance', 'Maintenance Alert: Tower A Lift', 'Tower A Lift status changed from Good to Fair. Service due in 10 days.', '2026-04-18T14:30:00+05:30'),
  ('n4', null, 'poll', 'New Poll: CCTV Expansion', 'A new community poll has been launched. Cast your vote before Apr 29.', '2026-04-22T09:00:00+05:30'),
  ('n5', null, 'event', 'New Event: Monthly Community Meetup', 'Monthly RWA meetup on May 4 at 11 AM in Banquet Hall. Register your interest.', '2026-04-21T11:00:00+05:30'),
  ('n6', null, 'poll', 'Poll Closed: Diwali Budget', 'The Diwali 2026 budget poll has ended. Winning option: ₹75k–1L. See results.', '2026-04-25T23:59:00+05:30');
