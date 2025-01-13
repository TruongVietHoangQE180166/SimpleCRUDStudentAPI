module.exports = {
  async up(db) {
    
    await db.collection('students').updateMany({}, {
      $set: { status: 'active' },
    });
    console.log('Added "status" field with default value "active" to all students.');
  },

  async down(db) {
    
    await db.collection('students').updateMany({}, {
      $unset: { status: '' },
    });
    console.log('Removed "status" field from all students.');
  },
};
